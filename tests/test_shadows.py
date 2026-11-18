from datetime import date
from pathlib import Path
import tempfile
import math
import unittest
import base64
import gzip
import json

import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon, MultiPolygon, box

from gismo_2026_fall_hackathon.shadows import (
    STUDY_BOUNDS, METRIC_CRS, ROOF_COLOR, buffered_bounds, daylight_steps, exposure_color, load_scene, prepare_scene,
)


# Fixture coordinates are drawn around (-73.987, 40.6905) and shifted to the current study area.
SHIFT = ((STUDY_BOUNDS[0] + STUDY_BOUNDS[2]) / 2 + 73.987, (STUDY_BOUNDS[1] + STUDY_BOUNDS[3]) / 2 - 40.6905)


def shifted(bounds):
    return (bounds[0] + SHIFT[0], bounds[1] + SHIFT[1], bounds[2] + SHIFT[0], bounds[3] + SHIFT[1])


def sample():
    courtyard = Polygon([(-73.99, 40.69), (-73.989, 40.69), (-73.989, 40.691), (-73.99, 40.691)],
                        holes=[[(-73.9898, 40.6902), (-73.9892, 40.6902), (-73.9892, 40.6908), (-73.9898, 40.6908)]])
    frame = gpd.GeoDataFrame({'height_roo': [100., 0., None], 'doitt_id': [1, 2, 3], 'bin': [3000001, 3000002, 3000003],
        'base_bbl': ['a', 'b', 'c'], 'feature_co': [2100, 2100, 2100], 'ground_ele': [0., 0., 0.]},
        geometry=[MultiPolygon([courtyard, box(-73.988, 40.69, -73.9879, 40.6901)]),
                  box(-73.986, 40.69, -73.985, 40.691), box(-73.984, 40.69, -73.983, 40.691)], crs=4326)
    frame.geometry = frame.geometry.translate(*SHIFT)
    return frame


class ShadowTests(unittest.TestCase):
    def test_exposure_ramp_and_payload(self):
        self.assertEqual(exposure_color(10, (10, 30)), [255, 255, 0])
        self.assertEqual(exposure_color(20, (10, 30)), [255, 128, 0])
        self.assertEqual(exposure_color(30, (10, 30)), [255, 0, 0])
        for missing in [None, float('nan'), float('inf')]:
            self.assertEqual(exposure_color(missing, (10, 30)), ROOF_COLOR)
        frame = sample()
        frame['roof_exposure'] = [20., None, None]
        scene = prepare_scene(frame, exposure_range=(10, 30))
        decoded = json.loads(gzip.decompress(base64.b64decode(scene.payload)))
        self.assertEqual(decoded['buildingInfo'], scene.spec['buildingInfo'])
        self.assertEqual(decoded['roofExposure'], {'range': [10, 30], 'measured': 1})
        roof = next(layer for layer in decoded['layers'] if layer['id'] == 'roofs')
        self.assertTrue(all(r['color'] == [255, 128, 0] for r in roof['data']))

    def test_roof_area_subtracts_holes_and_sums_parts(self):
        frame = sample().to_crs(METRIC_CRS)
        courtyard = Polygon([(0, 0), (20, 0), (20, 20), (0, 20)],
                            holes=[[(5, 5), (15, 5), (15, 15), (5, 15)]])
        # Place known metric geometry within NYC before projecting it for rendering.
        from shapely.affinity import translate
        origin = frame.geometry.iloc[0].centroid
        frame.loc[0, 'geometry'] = translate(MultiPolygon([courtyard, box(30, 0, 40, 10)]), origin.x, origin.y)
        scene = prepare_scene(frame)
        self.assertAlmostEqual(scene.spec['buildingInfo']['1']['roof_area_m2'], 400., places=2)

    def test_radiation_join_preserves_buildings_and_uses_global_range(self):
        with tempfile.TemporaryDirectory() as folder:
            path, radiation = Path(folder) / 'buildings.parquet', Path(folder) / 'radiation.parquet'
            frame = sample()
            frame['height_roo'] = 100.
            frame.to_parquet(path, write_covering_bbox=True)
            pd.DataFrame({'doitt_id': [99, 2, 1], 'MEAN_1': [30., float('inf'), 10.]}).to_parquet(radiation)
            scene = load_scene(path, radiation_path=radiation)
            self.assertEqual(scene.buildings, 3)
            self.assertEqual(scene.spec['roofExposure'], {'range': (10., 30.), 'measured': 1})
            self.assertEqual(scene.spec['buildingInfo']['1']['roof_exposure'], 10.)
            self.assertIsNone(scene.spec['buildingInfo']['2']['roof_exposure'])
            self.assertIsNone(scene.spec['buildingInfo']['3']['roof_exposure'])
            missing = load_scene(path, radiation_path=Path(folder) / 'missing.parquet')
            self.assertEqual(missing.buildings, 3)
            self.assertIsNone(missing.spec['roofExposure']['range'])
            baseline = prepare_scene(frame)
            for layer_id in ['walls', 'roofs']:
                actual = next(l for l in scene.spec['layers'] if l['id'] == layer_id)
                original = next(l for l in baseline.spec['layers'] if l['id'] == layer_id)
                self.assertEqual(len(actual['data']), len(original['data']))
            smaller = load_scene(path, bounds=shifted((-73.9901, 40.6899, -73.989, 40.6911)), buffer_m=0,
                                 radiation_path=radiation)
            roof_colors = lambda s: {r['building_id']: r['color'] for l in s.spec['layers'] if l['id'] == 'roofs' for r in l['data']}
            self.assertEqual(roof_colors(scene)['1'], roof_colors(smaller)['1'])

    def test_distinct_roofs_walls_preserve_holes_and_convert_feet(self):
        scene = prepare_scene(sample())
        self.assertEqual(scene.buildings, 1)
        self.assertEqual(scene.excluded, 2)
        layers = {layer['id']: layer for layer in scene.spec['layers']}
        self.assertEqual(len(layers['roofs']['data']), 2)
        self.assertEqual(len(layers['walls']['data']), 12)
        self.assertEqual(len(layers['roofs']['data'][0]['polygon']), 2)
        self.assertAlmostEqual(layers['roofs']['data'][0]['polygon'][0][0][2], 30.48)
        self.assertNotEqual(layers['roofs']['getFillColor'], layers['walls']['getFillColor'])
        self.assertTrue(layers['walls']['_full3d'])
        self.assertTrue(layers['walls']['shadowEnabled'])
        self.assertFalse(layers['walls']['extruded'])
        self.assertEqual(scene.spec['buildingInfo']['1']['bin'], '3000001')

    def test_permit_roofs_are_outlined_without_changing_building_records(self):
        with tempfile.TemporaryDirectory() as folder:
            path, permits = Path(folder) / 'buildings.parquet', Path(folder) / 'permits.parquet'
            sample().to_parquet(path, write_covering_bbox=True)
            pd.DataFrame({'Bin': [3000001., None, 9999999.]}).to_parquet(permits)
            scene = load_scene(path, permit_path=permits)
            layer = next(l for l in scene.spec['layers'] if l['id'] == 'permit-roofs')
            self.assertEqual(len(layer['data']), 2)  # Building 1 has two roof polygons.
            self.assertTrue(all(point[2] == 30.68 for outline in layer['data'] for point in outline['path']))
            self.assertEqual(scene.spec['permitRoofs'], 1)
            # Meters would turn a thin outline into a band that hides the roof color.
            for layer_id in ['permit-roofs', 'study-boundary']:
                self.assertEqual(next(l for l in scene.spec['layers'] if l['id'] == layer_id)['widthUnits'], 'pixels')
            self.assertEqual(scene.spec['buildingInfo'], load_scene(path).spec['buildingInfo'])
            missing = load_scene(path, permit_path=Path(folder) / 'missing.parquet')
            self.assertEqual(next(l for l in missing.spec['layers'] if l['id'] == 'permit-roofs')['data'], [])

    def test_bbox_read_and_building_limit(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'buildings.parquet'
            sample().to_parquet(path, write_covering_bbox=True)
            with self.assertRaisesRegex(ValueError, 'limit is 1'):
                load_scene(path, max_buildings=1)
            self.assertEqual(load_scene(path).buildings, 1)
            outside = (-74.2, 40.5, -74.19, 40.51)
            with self.assertRaisesRegex(ValueError, 'No buildings'):
                load_scene(path, bounds=outside)

    def test_metric_buffer_and_invalid_area(self):
        expanded = buffered_bounds(STUDY_BOUNDS)
        self.assertLess(expanded[0], STUDY_BOUNDS[0])
        self.assertGreater(expanded[3], STUDY_BOUNDS[3])
        for bounds in [(0, 0, 1, 1), (-74, 40.7, -74.1, 40.8), (float('nan'), 40.6, -74, 40.7)]:
            with self.assertRaises(ValueError):
                buffered_bounds(bounds)

    def test_winter_noon_reference_shadow(self):
        # NYC winter-noon elevation is about 26 degrees: a 100 m block casts a roughly 206 m shadow.
        step = daylight_steps(date(2026, 12, 21), 40.69, -73.99)[48]
        east, north, vertical = step['direction']
        self.assertGreater(north, 0)
        self.assertAlmostEqual(100 * math.hypot(east, north) / -vertical, 206.3, delta=2)

    def test_dst_daylight_and_solar_direction(self):
        summer = daylight_steps(date(2026, 6, 21), 40.69, -73.99)
        winter = daylight_steps(date(2026, 12, 21), 40.69, -73.99)
        self.assertEqual(len(summer), 96)
        self.assertLess(summer[0]['elevation'], 0)
        self.assertGreater(summer[48]['elevation'], winter[48]['elevation'])
        self.assertLess(summer[32]['direction'][0], 0)  # morning sun east, rays west
        self.assertGreater(summer[64]['direction'][0], 0)  # afternoon rays east
        self.assertEqual(len(daylight_steps(date(2026, 3, 8), 40.69, -73.99)), 92)
        fall = daylight_steps(date(2026, 11, 1), 40.69, -73.99)
        self.assertEqual(len(fall), 100)
        self.assertEqual(len({s['timestamp'] for s in fall}), 100)
        self.assertTrue(any('EDT' in s['label'] for s in fall))
        self.assertTrue(any('EST' in s['label'] for s in fall))
        self.assertTrue(all(b['timestamp']-a['timestamp'] == 900000 for a,b in zip(fall,fall[1:])))


if __name__ == '__main__':
    unittest.main()
