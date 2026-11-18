"""Solar joins, result snapshots, and local-model notes in the real page script."""
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
import pandas as pd
from streamlit.testing.v1 import AppTest
from gismo_2026_fall_hackathon.roof_solar import cache_directory, day_times
from gismo_2026_fall_hackathon.solar_queries import execute_tool
from test_shadows import sample

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src/streamlit'))
import shadow_view
import solar_chat


class SolarChatAppTests(unittest.TestCase):
    def test_calculated_query_snapshot_map_replay_and_collapsed_notes(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            sample().to_parquet(source, write_covering_bbox=True)
            cache = cache_directory(source)
            cache.mkdir(parents=True)
            pd.DataFrame({'doitt_id': [1], 'status': ['ok'], 'annual_kwh_m2': [1400.]}).to_parquet(cache / 'annual.parquet')
            times = day_times(pd.Timestamp('2026-06-21').date())
            values = np.full((96, 1), 100.)
            values[48] = 500.
            np.savez_compressed(cache / 'day-2026-06-21.npz', ids=[1], valid=[True],
                                timestamps=times.as_unit('ms').asi8, irradiance=values, sunlit=np.ones((96, 1)))
            seen = []

            def answer(client, model, question, conversation, inventory, *, context):
                result = execute_tool('count_buildings', {'roof_area_above_m2': 1500,
                                      'irradiance_above_w_m2': 494}, inventory, context=context)
                seen.append(result)
                return 'One matching roof.', [], [result]

            with patch.object(shadow_view, 'SOURCE', source), patch.object(solar_chat, 'setting', return_value='test-local-model'), \
                 patch.object(solar_chat, 'get_client'), patch.object(solar_chat, 'answer_question', side_effect=answer) as model, \
                 patch('gismo_2026_fall_hackathon.roof_solar.prepare', side_effect=AssertionError('no automatic preparation')):
                at = AppTest.from_file(str(ROOT / 'src/streamlit/Home.py'), default_timeout=30).run()
                at.switch_page('app_pages/shadow_simulation.py').run()
                self.assertFalse(at.exception)
                notes = next(expander for expander in at.expander if expander.label == 'About this local assistant')
                self.assertFalse(notes.proto.expanded)
                self.assertTrue(any('test-local-model' in item.value and '24 GB' in item.value for item in at.markdown))
                at.chat_input(key='solar_prompt').set_value('Area above 1500 and irradiance above 494?').run()
                self.assertFalse(at.exception)
                self.assertEqual(seen[0]['total_matches'], 1)
                self.assertIn('12:00', seen[0]['context']['time_label'])
                self.assertEqual(at.session_state.solar_chat['messages'][-1]['results'][0]['map_building_ids'], ['1'])
                at.session_state['shadow_map'] = {'slot': 49}
                at.run()
                at.button(key='solar_show_results').click().run()
                self.assertFalse(at.exception)
                self.assertEqual([row['building_id'] for row in at.session_state.solar_chat['records']], ['1'])
                self.assertEqual(model.call_count, 1)
                at.chat_input(key='solar_prompt').set_value('Repeat at the current time').run()
                self.assertFalse(at.exception)
                self.assertEqual(seen[-1]['total_matches'], 0)
                self.assertIn('12:15', seen[-1]['context']['time_label'])
                at.button(key='solar_reset').click().run()
                self.assertFalse(at.exception)
                self.assertEqual(at.session_state.solar_chat['messages'], [])

    def test_roof_area_suggestion_answer_is_cached(self):
        question = 'How many buildings have roof areas above 500 square meters?'
        self.addCleanup(solar_chat.cached_answer.clear)
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            sample().to_parquet(source, write_covering_bbox=True)

            def answer(client, model, question, conversation, inventory, *, context):
                result = execute_tool('count_buildings', {'roof_area_above_m2': 500}, inventory, context=context)
                return 'Matching roofs.', [], [result]

            with patch.object(shadow_view, 'SOURCE', source), patch.object(solar_chat, 'setting', return_value='test-local-model'), \
                 patch.object(solar_chat, 'get_client'), patch.object(solar_chat, 'answer_question', side_effect=answer) as model:
                at = AppTest.from_file(str(ROOT / 'src/streamlit/Home.py'), default_timeout=30).run()
                at.switch_page('app_pages/shadow_simulation.py').run()
                for _ in range(2):
                    at.pills(key='solar_suggestion').set_value(question).run()
                    self.assertFalse(at.exception)
                    self.assertEqual(at.session_state.solar_chat['messages'][-1]['content'], 'Matching roofs.')
                    at.button(key='solar_reset').click().run()
                self.assertEqual(model.call_count, 1)
