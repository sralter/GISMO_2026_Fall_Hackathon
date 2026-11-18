from pathlib import Path
from datetime import date
import json
import sys
import tempfile
import unittest
from unittest.mock import patch

from streamlit.testing.v1 import AppTest
from test_map_data import display_sample
from gismo_2026_fall_hackathon.shadows import STUDY_BOUNDS

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'src/streamlit'))
import explorer


class AppTests(unittest.TestCase):
    def setUp(self):
        temp=tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        data=Path(temp.name)
        (data/'DA4_3D_Buildings_Merged.gml').write_text('fixture')
        source=patch.object(explorer,'DATA',data)
        source.start();self.addCleanup(source.stop)
        loader=patch.object(explorer,'cached_sample',return_value=display_sample())
        loader.start();self.addCleanup(loader.stop)
        self.app=AppTest.from_file(str(ROOT/'src/streamlit/Home.py'),default_timeout=30).run()

    def test_slides_url_validation_and_persistence_across_shadow_navigation(self):
        import shadow_view
        from test_shadows import sample as shadow_sample
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            shadow_sample().to_parquet(source, write_covering_bbox=True)
            with patch.object(shadow_view, 'SOURCE', source):
                at = self.app.switch_page('app_pages/slides.py').run()
                self.assertFalse(at.exception)
                at.text_input(key='slides_url').set_value('<script>alert(1)</script>').run()
                self.assertFalse(at.exception)
                self.assertTrue(at.error)
                url = 'https://docs.google.com/presentation/d/example/edit'
                at.text_input(key='slides_url').set_value(url).run()
                self.assertFalse(at.exception)
                self.assertFalse(at.error)
                self.assertEqual(at.get('iframe')[0].proto.src,
                                 'https://docs.google.com/presentation/d/example/embed?start=false&loop=false&delayms=60000')
                at.switch_page('app_pages/shadow_simulation.py').run()
                self.assertFalse(at.exception)
                self.assertTrue(at.toggle(key='shadow_live').value)
                at.switch_page('app_pages/slides.py').run()
                self.assertFalse(at.exception)
                self.assertEqual(at.text_input(key='slides_url').value, url)
                self.assertFalse(at.error)

    def test_shadow_page_is_independent_and_solstice_controls_work(self):
        import shadow_view
        from test_shadows import sample as shadow_sample
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            shadow_sample().to_parquet(source, write_covering_bbox=True)
            with patch.object(shadow_view, 'SOURCE', source), patch.object(explorer, 'get_sample') as gml:
                at = self.app.switch_page('app_pages/shadow_simulation.py').run()
                self.assertFalse(at.exception)
                gml.assert_not_called()
                self.assertFalse(any(widget.key == 'source_file' for widget in at.selectbox))
                self.assertEqual(at.toggle(key='shadow_live').value, True)
                at.button(key='shadow_winter').click().run()
                self.assertFalse(at.exception)
                winter = at.date_input(key='shadow_date').value
                assert isinstance(winter, date)
                self.assertEqual(winter.month, 12)
                at.button(key='shadow_summer').click().run()
                self.assertFalse(at.exception)
                summer = at.date_input(key='shadow_date').value
                assert isinstance(summer, date)
                self.assertEqual(summer.month, 6)
                at.selectbox(key='shadow_area').set_value('NYC area').run()
                self.assertFalse(at.exception)
                at.number_input(key='shadow_west').set_value(0.0)
                at.button(key='shadow_load').click().run()
                self.assertFalse(at.exception)
                self.assertTrue(at.error)
                self.assertEqual(at.session_state.shadow_bounds, STUDY_BOUNDS)

    def test_count_chat_results_can_be_shown_on_map(self):
        import shadow_view
        import solar_chat
        from test_shadows import sample as shadow_sample
        from gismo_2026_fall_hackathon.solar_queries import execute_tool
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            shadow_sample().to_parquet(source, write_covering_bbox=True)
            with patch.object(shadow_view, 'SOURCE', source), patch.object(solar_chat, 'setting', return_value='local'), patch.object(solar_chat, 'get_client'):
                at = self.app.switch_page('app_pages/shadow_simulation.py').run()
                scene = shadow_view.cached_scene(str(source), STUDY_BOUNDS, shadow_view.source_stamp())
                result = execute_tool('count_buildings', {'roof_area_above_m2': 0}, scene.spec['buildingInfo'])
                with patch.object(solar_chat, 'answer_question', return_value=('Matching buildings.', [], [result])) as answer:
                    at.chat_input(key='solar_prompt').set_value('Count roofs').run()
                    self.assertFalse(at.exception)
                    self.assertEqual(at.session_state.solar_chat['records'], [])
                    before = at.session_state.shadow_camera_command
                    at.button(key='solar_show_results').click().run()
                    self.assertFalse(at.exception)
                    self.assertEqual(len(at.session_state.solar_chat['records']), result['total_matches'])
                    self.assertEqual(at.session_state.shadow_camera_command, before + 1)
                    self.assertEqual(answer.call_count, 1)
                    self.assertIsNone(solar_chat.results_camera(scene.spec, ['missing']))

    def test_solar_chat_results_focus_reset_and_failures(self):
        import shadow_view
        import solar_chat
        from test_shadows import sample as shadow_sample
        from gismo_2026_fall_hackathon.solar_queries import execute_tool
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'footprints.parquet'
            shadow_sample().to_parquet(source, write_covering_bbox=True)
            with patch.object(shadow_view, 'SOURCE', source), patch.object(solar_chat, 'setting', return_value='local'), patch.object(solar_chat, 'get_client'):
                at = self.app.switch_page('app_pages/shadow_simulation.py').run()
                self.assertFalse(at.exception)
                scene = shadow_view.cached_scene(str(source), STUDY_BOUNDS, shadow_view.source_stamp())
                result = execute_tool('get_top_buildings', {'metric': 'roof_area_m2', 'limit': 2}, scene.spec['buildingInfo'])
                with patch.object(solar_chat, 'answer_question', return_value=('Here are the roofs.', [], [result])) as answer:
                    at.chat_input(key='solar_prompt').set_value('Top roofs').run()
                    self.assertFalse(at.exception)
                    self.assertEqual(answer.call_count, 1)
                    self.assertEqual(len(at.dataframe), 1)
                    self.assertEqual(solar_chat.focus_camera(scene.spec, result['records'][0]['building_id'])['zoom'], 17)
                    at.button(key='solar_focus').click().run()
                    self.assertFalse(at.exception)
                    self.assertEqual(at.session_state.shadow_camera['zoom'], 17)
                    at.button(key='shadow_winter').click().run()
                    self.assertEqual(len(at.session_state.solar_chat['messages']), 2)
                    at.button(key='solar_reset').click().run()
                    self.assertFalse(at.exception)
                    self.assertEqual(at.session_state.solar_chat['messages'], [])
                with patch.object(solar_chat, 'answer_question', side_effect=ValueError('model offline')):
                    at.chat_input(key='solar_prompt').set_value('Count roofs').run()
                    self.assertFalse(at.exception)
                    self.assertTrue(at.error)
                    self.assertEqual(at.session_state.solar_chat['conversation'], [])
                with patch.object(solar_chat, 'setting', return_value=''):
                    at.run()
                    self.assertTrue(at.chat_input(key='solar_prompt').disabled)
                old_scene_id = at.session_state.solar_chat['scene_id']
                at.session_state.solar_chat['records'] = result['records']
                at.session_state.solar_chat['messages'] = [{'role': 'assistant', 'content': 'Old area'}]
                source.touch()
                at.run()
                self.assertNotEqual(at.session_state.solar_chat['scene_id'], old_scene_id)
                self.assertEqual(at.session_state.solar_chat['records'], [])
                self.assertEqual(at.session_state.solar_chat['messages'], [])

    def test_missing_footprints_keep_slides_usable(self):
        import shadow_view
        with patch.object(shadow_view, 'SOURCE', ROOT / 'missing-footprints.parquet'):
            at = self.app.switch_page('app_pages/shadow_simulation.py').run()
            self.assertFalse(at.exception)
            self.assertTrue(at.error)
            at.switch_page('app_pages/slides.py').run()
            self.assertFalse(at.exception)
            self.assertFalse(at.error)
            at.text_input(key='slides_url').set_value('https://docs.google.com/presentation/d/example/edit').run()
            self.assertFalse(at.exception)
            self.assertEqual(at.get('iframe')[0].proto.src,
                             'https://docs.google.com/presentation/d/example/embed?start=false&loop=false&delayms=60000')

    def test_map_selection_uses_shared_building_key(self):
        for obj in [{'building_key':'selected'}, {'properties':{'building_key':'selected'}}]:
            state={'chart':{'selection':{'objects':{'layer':[obj]}}}}
            with patch.object(explorer.st,'session_state',state):
                explorer.map_selection('chart')
            self.assertEqual(state['selected_building'],'selected')

    def test_3d_render_spec_keeps_vertical_triangles(self):
        sample=display_sample()
        selected=sample.buildings.building_key.iloc[0]
        with patch.object(explorer.st,'session_state',{'show_basemap':False}):
            deck=explorer.build_deck(sample,selected,'3D buildings','Surface type')
        spec=json.loads(deck.to_json())
        self.assertIsNone(spec.get('mapProvider'))
        layer=spec['layers'][0]
        self.assertTrue(layer['_full3d'])
        self.assertFalse(layer['extruded'])
        self.assertTrue(any(row['surface_kind']=='WallSurface' for row in layer['data']))

    def test_missing_dataset_keeps_presentation_usable(self):
        with tempfile.TemporaryDirectory() as empty, patch.object(explorer,'DATA',Path(empty)):
            at=self.app.run()
            self.assertFalse(at.exception)
            self.assertTrue(at.text_input(key='slides_url'))
            self.assertFalse(at.session_state.sample_available)


if __name__=='__main__': unittest.main()
