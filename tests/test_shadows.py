from datetime import date
from pathlib import Path
import tempfile
import math
import unittest

import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon, box

from gismo_2026_fall_hackathon.shadows import (
    STUDY_BOUNDS, buffered_bounds, daylight_steps, load_scene, prepare_scene,
)


def sample():
    courtyard = Polygon([(-73.99, 40.69), (-73.989, 40.69), (-73.989, 40.691), (-73.99, 40.691)],
                        holes=[[(-73.9898, 40.6902), (-73.9892, 40.6902), (-73.9892, 40.6908), (-73.9898, 40.6908)]])
    return gpd.GeoDataFrame({'height_roo': [100., 0., None], 'doitt_id': [1, 2, 3], 'bin': [3000001, 3000002, 3000003],
        'base_bbl': ['a', 'b', 'c'], 'feature_co': [2100, 2100, 2100], 'ground_ele': [0., 0., 0.]},
        geometry=[MultiPolygon([courtyard, box(-73.988, 40.69, -73.9879, 40.6901)]),
                  box(-73.986, 40.69, -73.985, 40.691), box(-73.984, 40.69, -73.983, 40.691)], crs=4326)


class ShadowTests(unittest.TestCase):
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
