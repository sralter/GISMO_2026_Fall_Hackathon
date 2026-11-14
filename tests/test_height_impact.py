from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import box
from streamlit.testing.v1 import AppTest

from gismo_2026_fall_hackathon import height_impact as impact

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/streamlit'))
import explorer


class HeightImpactTests(unittest.TestCase):
    def test_local_sources_join_and_unchanged_height(self):
        self.assertEqual(impact.DATA_DIR, ROOT / 'data/buildings')
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            permits = Path(folder) / 'permits.parquet'
            gpd.GeoDataFrame({
                'doitt_id': [1, 2], 'bin': [100, 200], 'height_roo': [30., 20.],
                'NumFloors': [3., 2.], 'MEAN_1': [100., 120.],
            }, geometry=[box(0, 0, 10, 10), box(0, 20, 10, 30)], crs=impact.METRIC_CRS).to_parquet(source)
            pd.DataFrame({
                'Bin': [200], 'House No': ['10'], 'Street Name': ['TEST ST'],
                'Borough': ['BROOKLYN'], 'Permit Status': ['ISSUED'],
                'Estimated Job Costs': [1000.], 'Latitude': [40.7], 'Longitude': [-74.],
            }).to_parquet(permits)
            frame = impact.load_footprints(source)
            original = frame.copy(deep=True)
            sites = impact.load_permit_sites(permits, frame)
            self.assertEqual(sites.index.tolist(), ['2'])
            samples = pd.DataFrame({'elevation': [30.], 'azimuth': [180.],
                                    'ghi': [500.], 'beam_horizontal': [400.], 'weight': [1.]})
            result = impact.simulate_height_increase(frame, '1', 0, samples, targets=sites.index)
            np.testing.assert_allclose(result.delta_kwh_per_year, 0)
            np.testing.assert_allclose(result.delta_usd_per_year, 0)
            self.assertTrue(frame.equals(original))

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
