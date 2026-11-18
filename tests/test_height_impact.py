from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point, box
from streamlit.testing.v1 import AppTest

from gismo_2026_fall_hackathon import height_impact as impact
from gismo_2026_fall_hackathon.shadows import IMPACT_BOUNDS

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/streamlit'))
import explorer

CENTER = gpd.GeoSeries([Point((IMPACT_BOUNDS[0] + IMPACT_BOUNDS[2]) / 2, (IMPACT_BOUNDS[1] + IMPACT_BOUNDS[3]) / 2)],
                       crs='OGC:CRS84').to_crs(impact.METRIC_CRS).iloc[0]


def footprints_file(folder: str, rows: list[dict]) -> Path:
    """Dataset 09-shaped GeoParquet; each row gives a box offset (m) from the study-area center."""
    geometry = [box(CENTER.x + r['x'], CENTER.y + r['y'], CENTER.x + r['x'] + r.get('size', 10),
                    CENTER.y + r['y'] + r.get('size', 10)) for r in rows]
    frame = gpd.GeoDataFrame({
        'doitt_id': [r['id'] for r in rows], 'bin': [r.get('bin', 3000000 + r['id']) for r in rows],
        'height_roo': [r.get('height', 30.) for r in rows], 'ground_ele': [10.] * len(rows),
        'feature_co': [r.get('feature', 2100) for r in rows],
    }, geometry=geometry, crs=impact.METRIC_CRS).to_crs('OGC:CRS84')
    path = Path(folder) / 'footprints.parquet'
    frame.to_parquet(path, write_covering_bbox=True)
    return path


class HeightImpactTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.weather = impact.annual_weather()

    def test_loads_footprints_and_joins_permits_by_bin(self):
        self.assertEqual(impact.FOOTPRINTS_PATH, ROOT / 'data/buildings/09_NYC_Building_Footprints.parquet')
        with tempfile.TemporaryDirectory() as folder:
            source = footprints_file(folder, [
                {'id': 1, 'x': 0, 'y': 0, 'height': 34.}, {'id': 2, 'x': 0, 'y': 30, 'bin': 200},
                {'id': 3, 'x': 50, 'y': 0, 'feature': 1003}, {'id': 4, 'x': 80, 'y': 0, 'height': 0.}])
            permits = Path(folder) / 'permits.parquet'
            pd.DataFrame({
                'Bin': [200], 'House No': ['10'], 'Street Name': ['TEST ST'],
                'Borough': ['BROOKLYN'], 'Permit Status': ['ISSUED'],
                'Estimated Job Costs': [1000.], 'Latitude': [40.66], 'Longitude': [-73.98],
            }).to_parquet(permits)
            frame = impact.load_footprints(source)
            self.assertEqual(frame.index.tolist(), ['1', '2'])  # Feature 1003 and zero height are excluded.
            self.assertEqual(frame.at['1', 'floors'], 3)
            self.assertTrue(frame.in_study_area.all())
            sites = impact.load_permit_sites(permits, frame)
            self.assertEqual(sites.index.tolist(), ['2'])
            self.assertTrue(sites.at['2', 'in_study_area'])

    def scene(self, folder: str, rows: list[dict]) -> gpd.GeoDataFrame:
        return impact.load_footprints(footprints_file(folder, rows))

    def test_taller_raised_building_never_increases_neighbour_kwh(self):
        with tempfile.TemporaryDirectory() as folder:
            # A wide building 50 m south of the target, beyond a one-building index's own extent.
            frame = self.scene(folder, [{'id': 1, 'x': 0, 'y': 0},
                                        {'id': 2, 'x': -25, 'y': -110, 'size': 60, 'height': 40.}])
            original = frame.copy(deep=True)
            runs = [impact.roof_kwh_m2(frame, '2', added, ['1'], self.weather).loc['1'] for added in (0, 100, 300)]
            self.assertTrue(frame.equals(original))
            np.testing.assert_allclose([run.annual_kwh_m2_before for run in runs], runs[0].annual_kwh_m2_before)
            self.assertAlmostEqual(runs[0].annual_kwh_m2_after, runs[0].annual_kwh_m2_before)
            self.assertLessEqual(runs[1].annual_kwh_m2_after, runs[0].annual_kwh_m2_after)
            self.assertLessEqual(runs[2].annual_kwh_m2_after, runs[1].annual_kwh_m2_after)
            self.assertLess(runs[2].annual_kwh_m2_after, runs[0].annual_kwh_m2_after * 0.9)
            self.assertLessEqual(runs[0].annual_kwh_m2_before, runs[0].unobstructed_kwh_m2)

    def test_zero_added_height_changes_nothing(self):
        with tempfile.TemporaryDirectory() as folder:
            frame = self.scene(folder, [{'id': 1, 'x': 0, 'y': 0}, {'id': 2, 'x': 0, 'y': -20, 'height': 40.}])
            result = impact.simulate_height_increase(frame, '2', 0, self.weather, permit_ids=['1'])
            self.assertEqual(result.building_id.tolist(), ['1'])
            self.assertTrue(result.is_permit.all())
            np.testing.assert_allclose(result.delta_kwh_per_year, 0)
            np.testing.assert_allclose(result.delta_usd_per_year, 0)

    def test_shadow_zone_and_scored_roofs(self):
        with tempfile.TemporaryDirectory() as folder:
            # Raised to ~39 m: 10° shadows reach ~170 m to the NW and NE; the sky ring is ~78 m all round.
            frame = self.scene(folder, [{'id': 1, 'x': 0, 'y': 0}, {'id': 2, 'x': -100, 'y': 100},
                                        {'id': 3, 'x': 0, 'y': -40}, {'id': 4, 'x': 0, 'y': -150},
                                        {'id': 5, 'x': 0, 'y': 30, 'height': 200.}])
            # Northwest in low-sun shadow and close south in the ring: in. Far south: out.
            zone = impact.impact_zone(frame, '1', 100 * impact.FEET_TO_METERS, self.weather)
            self.assertEqual(zone.index.tolist(), ['5', '3', '2'])
            # The roof taller than the new top is in the zone but cannot be shaded, so it is not scored.
            rows, _ = impact.shade_scenario(frame, '1', 100, self.weather)
            self.assertEqual(rows.building_id.tolist(), ['3', '2'])

    def test_navigation_and_missing_data_without_citygml(self):
        with tempfile.TemporaryDirectory() as folder, \
             patch.object(impact, 'FOOTPRINTS_PATH', Path(folder) / 'missing.parquet'), \
             patch.object(explorer, 'DATA', Path(folder)):
            at = AppTest.from_file(str(ROOT / 'src/streamlit/Home.py')).run()
            with patch.object(explorer, 'get_sample') as loader:
                at.switch_page('app_pages/height_impact.py').run()
                self.assertFalse(at.exception)
                loader.assert_not_called()
                self.assertIn('data/buildings/', at.error[0].value)


if __name__ == '__main__':
    unittest.main()
