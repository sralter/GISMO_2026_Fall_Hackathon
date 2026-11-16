"""Solar controls use cached numbers without starting analysis on page load."""
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
import pandas as pd
from streamlit.testing.v1 import AppTest

from gismo_2026_fall_hackathon.roof_solar import cache_directory, day_times
from test_shadows import sample

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/streamlit'))
import explorer
import shadow_view


class SolarAppTests(unittest.TestCase):
    def test_annual_timestamp_and_unprepared_date(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            sample().to_parquet(source, write_covering_bbox=True)
            cache = cache_directory(source)
            cache.mkdir(parents=True)
            pd.DataFrame({'doitt_id': [1], 'roof_area_m2': [100.], 'status': ['ok'],
                          'annual_kwh_m2': [1400.]}).to_parquet(cache / 'annual.parquet')
            times = day_times(pd.Timestamp('2026-06-21').date())
            np.savez_compressed(cache / 'day-2026-06-21.npz', ids=np.array([1]),
                                timestamps=times.as_unit('ms').asi8,
                                irradiance=np.full((96, 1), 500.), sunlit=np.full((96, 1), .75), valid=[True])
            with patch.object(shadow_view, 'SOURCE', source), patch.object(explorer, 'DATA', Path(folder)), \
                 patch('gismo_2026_fall_hackathon.roof_solar.prepare', side_effect=AssertionError('no automatic preparation')):
                at = AppTest.from_file(str(ROOT / 'src/streamlit/Home.py'), default_timeout=30).run()
                at.switch_page('app_pages/shadow_simulation.py').run()
                self.assertFalse(at.exception)
                self.assertEqual(at.segmented_control(key='shadow_color_mode').value, 'Annual clear-sky')
                at.segmented_control(key='shadow_color_mode').set_value('Selected time').run()
                self.assertFalse(at.exception)
                self.assertFalse(any(b.key == 'shadow_prepare_day' for b in at.button))
                at.button(key='shadow_winter').click().run()
                self.assertFalse(at.exception)
                self.assertTrue(at.button(key='shadow_prepare_day'))
                at.segmented_control(key='shadow_color_mode').set_value('Colleague’s June 21 data').run()
                self.assertFalse(at.exception)
                self.assertFalse(any(b.key == 'shadow_prepare_day' for b in at.button))


if __name__ == '__main__':
    unittest.main()
