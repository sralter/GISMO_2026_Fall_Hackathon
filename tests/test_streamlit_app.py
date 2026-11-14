from pathlib import Path
import json
import sys
import tempfile
import unittest
from unittest.mock import patch

from streamlit.testing.v1 import AppTest
from test_map_data import display_sample

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

    def test_pages_selection_views_and_url_validation(self):
        at=self.app
        self.assertFalse(at.exception)
        initial=at.session_state.selected_building
        at.segmented_control(key='view_mode').set_value('2D map').run()
        self.assertFalse(at.exception)
        at.switch_page('app_pages/demo.py').run()
        self.assertFalse(at.exception)
        self.assertEqual(at.session_state.selected_building,initial)
        self.assertEqual(at.segmented_control(key='view_mode').value,'2D map')
        self.assertEqual(len(at.dataframe),1)
        self.assertEqual(len(at.dataframe[0].value),6)
        self.assertEqual(at.metric[0].value,'1')
        at.segmented_control(key='view_mode').set_value('3D buildings').run()
        at.segmented_control(key='color_by').set_value('Inclination').run()
        self.assertFalse(at.exception)
        at.switch_page('app_pages/presentation.py').run()
        self.assertEqual(at.segmented_control(key='color_by').value,'Inclination')
        self.assertEqual(at.segmented_control(key='view_mode').value,'3D buildings')
        at.text_input(key='slides_url').set_value('<script>alert(1)</script>').run()
        self.assertFalse(at.exception)
        self.assertTrue(at.error)
        at.text_input(key='slides_url').set_value('https://docs.google.com/presentation/d/example/edit').run()
        self.assertFalse(at.exception)
        self.assertFalse(at.error)
        at.switch_page('app_pages/demo.py').run()
        at.switch_page('app_pages/presentation.py').run()
        self.assertEqual(at.text_input(key='slides_url').value,'https://docs.google.com/presentation/d/example/edit')

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
                self.assertEqual(at.date_input(key='shadow_date').value.month, 12)
                at.button(key='shadow_summer').click().run()
                self.assertFalse(at.exception)
                self.assertEqual(at.date_input(key='shadow_date').value.month, 6)
                at.selectbox(key='shadow_area').set_value('NYC area').run()
                self.assertFalse(at.exception)
                at.number_input(key='shadow_west').set_value(0.0)
                at.button(key='shadow_load').click().run()
                self.assertFalse(at.exception)
                self.assertTrue(at.error)
                self.assertEqual(at.session_state.shadow_bounds, (-74.001, 40.685, -73.974, 40.702))

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
                scene = shadow_view.cached_scene(str(source), (-74.001, 40.685, -73.974, 40.702), shadow_view.source_stamp())
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
            self.assertTrue(at.text_input(key='slides_url'))

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

    def test_prior_project_placeholder_is_registered_and_renders(self):
        at = self.app.switch_page('app_pages/1_Low-Res_Change_Detection.py').run()
        self.assertFalse(at.exception)
        self.assertEqual(at.header[0].value, 'Low-resolution satellite image change detection')
        self.assertIn('docs.google.com/presentation/', at.get('iframe')[0].proto.src)
        self.assertTrue(at.button(key='change_detection_build').disabled)


if __name__=='__main__': unittest.main()
