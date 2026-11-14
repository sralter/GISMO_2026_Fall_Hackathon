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
