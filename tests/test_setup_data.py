from contextlib import redirect_stdout
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import geopandas as gpd
import pandas as pd
import pyarrow.parquet as pq
from shapely.geometry import box


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('setup_data', ROOT / 'scripts/setup_data.py')
setup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(setup)
GML = '''<CityModel xmlns="http://www.opengis.net/citygml/2.0"
 xmlns:bldg="http://www.opengis.net/citygml/building/2.0"
 xmlns:gml="http://www.opengis.net/gml"><cityObjectMember>
 <bldg:Building gml:id="test"/></cityObjectMember></CityModel>'''


class SetupDataTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.output = io.StringIO()
        self.redirect = redirect_stdout(self.output)
        self.redirect.__enter__()
        self.addCleanup(self.redirect.__exit__, None, None, None)

    def archive(self, extra=None, omit=None):
        archive = self.root / 'source.zip'
        with zipfile.ZipFile(archive, 'w') as target:
            for name in sorted(setup.GML_NAMES | setup.SIDECARS):
                if name == omit:
                    continue
                prefix = 'wrapper/DA_WISE_GMLs/' if name in setup.GML_NAMES else 'wrapper/'
                target.writestr(prefix + name, GML if name.endswith('.gml') else 'sidecar')
            if extra:
                target.writestr(*extra)
        return archive

    def parquet_inputs(self):
        buildings = self.root / 'data/buildings'
        buildings.mkdir(parents=True)
        frame = gpd.GeoDataFrame({
            'height_roo': [50.], 'ground_ele': [5.], 'doitt_id': [1], 'bin': [3000001],
            'base_bbl': ['1'], 'feature_co': [2100],
        }, geometry=[box(-73.99, 40.69, -73.98, 40.70)], crs=4326)
        frame.to_parquet(buildings / setup.FOOTPRINTS, write_covering_bbox=True)
        frame['MEAN_1'] = 10.
        frame.to_crs(2263).to_parquet(buildings / setup.RADIATION)
        pd.DataFrame({name: [1] for name in [
            'Bin', 'House No', 'Street Name', 'Borough', 'Permit Status',
            'Estimated Job Costs', 'Latitude', 'Longitude',
        ]}).to_parquet(buildings / setup.PERMITS)

    def test_extract_normalizes_prefixes_and_preserves_inputs(self):
        archive = self.archive()
        setup.extract_gml(archive, self.root)
        target = self.root / 'data/DA_WISE_GML/DA_WISE_GMLs/DA1_3D_Buildings_Merged.gml'
        self.assertEqual(target.read_text(), GML)
        self.assertTrue((self.root / 'data/DA_WISE_GML/DeliveryArea.shp').is_file())
        target.write_text('existing file')
        setup.extract_gml(archive, self.root)
        self.assertEqual(target.read_text(), 'existing file')

    def test_rejects_unsafe_archive_before_extraction(self):
        for name in ['../escape', '/absolute', 'wrapper/../../escape', 'wrapper\\escape']:
            with self.subTest(name=name):
                with self.assertRaisesRegex(ValueError, 'Unsafe archive'):
                    setup.extract_gml(self.archive(extra=(name, 'bad')), self.root)
                self.assertFalse((self.root / 'data').exists())

    def test_rejects_incomplete_and_duplicate_archives(self):
        with self.assertRaisesRegex(ValueError, 'Incomplete'):
            setup.extract_gml(self.archive(omit='DeliveryArea.dbf'), self.root)
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            setup.extract_gml(self.archive(extra=('other/DeliveryArea.dbf', 'duplicate')), self.root)
        self.assertFalse((self.root / 'data').exists())

    def test_missing_data_reports_incomplete(self):
        self.assertEqual(setup.check_data(self.root), 1)
        self.assertIn('INCOMPLETE: Height impact', self.output.getvalue())

    def test_complete_setup_and_optional_permits(self):
        self.parquet_inputs()
        setup.extract_gml(self.archive(), self.root)
        self.assertEqual(setup.check_data(self.root), 0)
        (self.root / 'data/buildings' / setup.PERMITS).unlink()
        self.assertEqual(setup.check_data(self.root), 1)
        self.assertIn('READY: Height impact\n', self.output.getvalue())
        self.assertIn('INCOMPLETE: Height impact with permit overlays', self.output.getvalue())

    def test_parquet_schema_crs_and_covering(self):
        self.parquet_inputs()
        path = self.root / 'data/buildings' / setup.FOOTPRINTS
        table = pq.read_table(path)
        with self.assertRaisesRegex(ValueError, 'Missing columns'):
            setup.check_parquet(path, ['missing'])
        original = dict(table.schema.metadata)
        for change, error in [
            ({'crs': None}, 'CRS is unknown'),
            ({'crs': 'EPSG:2263'}, 'WGS84'),
            ({'covering': {}}, 'covering metadata'),
            ({'covering': {'bbox': {key: ['absent', key] for key in ['xmin', 'ymin', 'xmax', 'ymax']}}}, None),
        ]:
            metadata = dict(original)
            geo = json.loads(metadata[b'geo'])
            geo['columns']['geometry'].update(change)
            metadata[b'geo'] = json.dumps(geo).encode()
            pq.write_table(table.replace_schema_metadata(metadata), path)
            with self.subTest(change=change):
                if error:
                    with self.assertRaisesRegex(ValueError, error):
                        setup.check_parquet(path, ['geometry'], geographic=True)
                else:
                    with self.assertRaises(KeyError):
                        setup.check_parquet(path, ['geometry'], geographic=True)

    def test_download_uses_temporary_archive_and_cleans_up_on_failure(self):
        content = self.archive().read_bytes()
        with patch.object(setup.urllib.request, 'urlopen', return_value=io.BytesIO(content)), \
                patch.object(setup, 'extract_gml', side_effect=ValueError('bad zip')) as extract:
            with self.assertRaisesRegex(ValueError, 'bad zip'):
                setup.download_gml(self.root)
            self.assertFalse(extract.call_args.args[0].exists())

    def test_invalid_and_empty_gml_fail_check(self):
        self.parquet_inputs()
        setup.extract_gml(self.archive(), self.root)
        folder = self.root / 'data/DA_WISE_GML/DA_WISE_GMLs'
        (folder / 'DA1_3D_Buildings_Merged.gml').write_text('<bad>')
        (folder / 'DA2_3D_Buildings_Merged.gml').write_text(
            '<CityModel xmlns="http://www.opengis.net/citygml/2.0"/>')
        (folder / 'DA7_3D_Buildings_Merged.gml').write_text(
            GML.replace('citygml/2.0', 'citygml/1.0').replace('building/2.0', 'building/1.0'))
        self.assertEqual(setup.check_data(self.root), 1)
        self.assertIn('No top-level CityGML building', self.output.getvalue())
        self.assertIn('FAIL DA7_3D_Buildings_Merged.gml: Expected a CityGML 2.0', self.output.getvalue())


if __name__ == '__main__':
    unittest.main()
