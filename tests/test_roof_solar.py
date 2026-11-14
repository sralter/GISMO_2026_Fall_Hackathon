from datetime import date
import tempfile
from pathlib import Path
import unittest
from unittest.mock import patch

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Polygon, MultiPolygon, box

from gismo_2026_fall_hackathon.roof_solar import (
    HorizonIndex, SolarConfig, annual_times, cache_directory, clean_buildings,
    day_times, evaluate, load_results, prepare, sample_roof, solar_weather,
)


def buildings(geometries, heights=None, ground=None):
    count = len(geometries)
    return clean_buildings(gpd.GeoDataFrame({'doitt_id': np.arange(1, count + 1),
        'height_roo': np.asarray(heights or [10.] * count) / .3048,
        'ground_ele': np.asarray(ground or [0.] * count) / .3048,
        'feature_co': [2100] * count}, geometry=geometries, crs=32618))


def weather(elevation, azimuth):
    return pd.DataFrame({'dni': [800.] * len(elevation), 'dhi': [100.] * len(elevation),
                         'elevation': elevation, 'azimuth': azimuth})


class RoofSolarTests(unittest.TestCase):
    def test_sampling_area_holes_and_parts(self):
        courtyard = Polygon([(0, 0), (20, 0), (20, 20), (0, 20)],
                            holes=[[(5, 5), (15, 5), (15, 15), (5, 15)]])
        geometry = MultiPolygon([courtyard, box(30, 0, 33, 2)])
        points, weights = sample_roof(geometry, 5)
        from shapely.geometry import Point
        self.assertTrue(all(geometry.contains(Point(*p)) for p in points))
        self.assertAlmostEqual(weights.sum(), 306.)

    def test_neighbor_partial_shade_and_ground_elevation(self):
        frame = buildings([box(0, 0, 10, 10), box(20, 0, 30, 10)], [10., 20.], [0., 10.])
        index = HorizonIndex(frame)
        h = index.horizons(np.array([[5., 2.5, 10.02], [5., 12.5, 10.02]]), 5.)
        self.assertAlmostEqual(h[0, 18], np.degrees(np.arctan(19.98 / 15)), places=3)
        self.assertEqual(h[1, 18], 0.)
        result, lit = evaluate(h, np.array([0, 0]), np.array([1., 3.]), 1,
                               weather([30., 80., -5.], [90., 90., 90.]))
        self.assertEqual(lit[:, 0].tolist(), [.75, 1., 0.])
        self.assertGreater(result[0, 0], 800 * .5 * .75)  # Diffuse survives direct shade.
        self.assertLessEqual(result[1, 0], 800 * np.sin(np.deg2rad(80)) + 100)
        self.assertEqual(result[2, 0], 0.)

    def test_isolated_roof_has_no_self_shade(self):
        index = HorizonIndex(buildings([box(0, 0, 10, 10)]))
        h = index.horizons(np.array([[5., 5., 10.02]]), 5.)
        self.assertTrue(np.all(h == 0))
        result, lit = evaluate(h, np.array([0]), np.array([100.]), 1, weather([30.], [0.]))
        self.assertAlmostEqual(float(result[0, 0]), 500., places=3)
        self.assertEqual(lit[0, 0], 1.)

    def test_courtyard_opening_and_tall_surrounding_walls(self):
        courtyard = Polygon([(-10,-10),(10,-10),(10,10),(-10,10)],
                            holes=[[(-5,-5),(5,-5),(5,5),(-5,5)]])
        index = HorizonIndex(buildings([courtyard], [20.]))
        h = index.horizons(np.array([[0., 0., 10.02]]), 5.)
        self.assertGreater(h.min(), 50.)
        result, lit = evaluate(h, np.array([0]), np.array([1.]), 1, weather([20.], [90.]))
        self.assertEqual(lit[0, 0], 0.)
        self.assertGreater(result[0, 0], 0.)
        self.assertLess(result[0, 0], 100.)

    def test_time_axes_and_annual_energy(self):
        self.assertEqual(len(annual_times(2026)), 8760)
        self.assertEqual(len(annual_times(2024)), 8784)
        self.assertEqual(len(day_times(date(2026, 3, 8))), 92)
        self.assertEqual(len(day_times(date(2026, 11, 1))), 100)
        h = np.zeros((1, 72))
        result, _ = evaluate(h, np.array([0]), np.array([1.]), 1, weather([30.] * 24, [0.] * 24))
        self.assertAlmostEqual(float(result.sum() / 1000), 12.)
        actual = solar_weather(day_times(date(2026, 6, 21)))
        self.assertTrue((actual[['dni', 'dhi']] >= 0).all().all())

    def test_cache_fingerprint_and_checkpoint_resume(self):
        frame = buildings([box(584500, 4505000, 584510, 4505010)])
        frame['height_roo'] = 100.
        config = SolarConfig()
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            frame.to_crs(4326).to_parquet(source, write_covering_bbox=True)
            first = cache_directory(source, config)
            self.assertNotEqual(first, cache_directory(source, SolarConfig(spacing_m=2.5)))
            root = prepare(source, config, days=(date(2026, 6, 21),), workers=1, progress=lambda _: None)
            results = load_results(source, config, date(2026, 6, 21))
            self.assertTrue((results['annual'].annual_kwh_m2 > 0).all())
            self.assertEqual(results['day']['irradiance'].shape, (96, 1))
            before = (root / 'horizon-0000.npz').stat().st_mtime_ns
            (root / 'annual.parquet').unlink()
            with patch.object(HorizonIndex, 'horizons', side_effect=AssertionError('must reuse horizons')):
                prepare(source, config, workers=1, progress=lambda _: None)
            self.assertEqual(before, (root / 'horizon-0000.npz').stat().st_mtime_ns)
            source.touch()
            self.assertNotEqual(first, cache_directory(source, config))

    def test_missing_ground_is_flagged(self):
        frame = buildings([box(0,0,5,5)])
        frame['ground_ele'] = np.nan
        self.assertEqual(clean_buildings(frame).status.iloc[0], 'missing ground elevation')


if __name__ == '__main__':
    unittest.main()
