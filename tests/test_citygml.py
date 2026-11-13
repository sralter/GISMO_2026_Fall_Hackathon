"""Small fixtures exercise geometry cases absent from the default NYC sample."""
import tempfile
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET
from unittest.mock import patch

from gismo_2026_fall_hackathon.citygml import iter_buildings

RING = '0 0 5 4 0 5 4 4 5 0 0 5'
HOLE = '1 1 5 2 1 5 2 2 5 1 1 5'


def polygon(coords=RING, hole=False):
    interior = f'<gml:interior><gml:LinearRing><gml:posList>{HOLE}</gml:posList></gml:LinearRing></gml:interior>' if hole else ''
    return f'<gml:surfaceMember><gml:Polygon><gml:exterior><gml:LinearRing><gml:posList>{coords}</gml:posList></gml:LinearRing></gml:exterior>{interior}</gml:Polygon></gml:surfaceMember>'


def surface(geometry=None):
    return f'<bldg:boundedBy><bldg:RoofSurface gml:id="roof"><bldg:lod2MultiSurface><gml:MultiSurface>{polygon() if geometry is None else geometry}</gml:MultiSurface></bldg:lod2MultiSurface></bldg:RoofSurface></bldg:boundedBy>'


def building(content=None, bid='b1'):
    return f'<bldg:Building gml:id="{bid}"><gml:name>Example</gml:name><gen:stringAttribute name="BIN"><gen:value>00123</gen:value></gen:stringAttribute>{surface() if content is None else content}</bldg:Building>'


def document(buildings):
    return f'''<CityModel xmlns="http://www.opengis.net/citygml/2.0" xmlns:bldg="http://www.opengis.net/citygml/building/2.0" xmlns:gml="http://www.opengis.net/gml" xmlns:gen="http://www.opengis.net/citygml/generics/2.0" xmlns:xlink="http://www.w3.org/1999/xlink"><gml:boundedBy><gml:Envelope srsName="EPSG:2263" srsDimension="3"/></gml:boundedBy>{''.join('<cityObjectMember>'+b+'</cityObjectMember>' for b in buildings)}</CityModel>'''


class ReaderTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'test.gml'

    def read(self, xml, limit=None):
        self.path.write_text(xml)
        return list(iter_buildings(self.path, limit))

    def test_metadata_holes_and_multiple_polygons(self):
        b, = self.read(document([building(surface(polygon(hole=True) + polygon()))]))
        self.assertEqual((b.id, b.name, b.metadata['BIN']), ('b1', 'Example', '00123'))
        s, = b.surfaces
        self.assertEqual((s.id, s.kind, s.owner_path), ('roof', 'RoofSurface', ('b1',)))
        self.assertEqual(len(s.polygons), 2)
        p = s.polygons[0]
        self.assertEqual((p.crs, p.dimension, p.exterior.shape), ('EPSG:2263', 3, (4, 3)))
        self.assertEqual(p.interiors[0].tolist()[0], [1, 1, 5])
        self.assertFalse(b.issues)

    def test_invalid_ring_excludes_entire_polygon(self):
        for bad in ['0 0', 'nan 0 5 4 0 5 4 4 5 nan 0 5',
                    '0 0 5 4 0 5 4 4 5 1 1 5', '0 0 5 0 0 5 0 0 5 0 0 5']:
            with self.subTest(bad=bad):
                b, = self.read(document([building(surface(polygon(bad) + polygon()))]))
                self.assertEqual(len(b.surfaces[0].polygons), 1)
                self.assertIn('Excluded polygon', b.issues[0].message)
        bad_hole = polygon(hole=True).replace(HOLE, '0 0')
        b, = self.read(document([building(surface(bad_hole))]))
        self.assertFalse(b.surfaces[0].polygons)
        self.assertTrue(b.issues)

    def test_references_and_unsupported_geometry_are_reported(self):
        geometry = '<gml:surfaceMember xlink:href="#elsewhere"/><gml:Triangle/><gml:pos>1 2 3</gml:pos>'
        b, = self.read(document([building(surface(geometry))]))
        messages = '\n'.join(i.message for i in b.issues)
        for text in ['#elsewhere', 'Unsupported geometry: Triangle', 'Unsupported coordinate encoding: pos', 'no inline Polygon']:
            self.assertIn(text, messages)
        self.assertFalse(b.surfaces[0].polygons)

    def test_part_ownership_and_metadata(self):
        part = building(surface(), 'part1').replace('bldg:Building', 'bldg:BuildingPart')
        b, = self.read(document([building(surface() + '<bldg:consistsOfBuildingPart>' + part + '</bldg:consistsOfBuildingPart>')]))
        self.assertEqual(len(b.surfaces), 1)
        p, = b.parts
        self.assertEqual((p.id, p.kind, p.metadata['BIN']), ('part1', 'BuildingPart', '00123'))
        self.assertEqual(p.surfaces[0].owner_path, ('b1', 'part1'))
        self.assertFalse(b.issues)

    def test_crs_dimension_and_xml_validation(self):
        for before, after in [('srsDimension="3"', 'srsDimension="2"'),
                              ('srsName="EPSG:2263"', '')]:
            b, = self.read(document([building()]).replace(before, after))
            self.assertFalse(b.surfaces[0].polygons)
            self.assertTrue(b.issues)
        with self.assertRaisesRegex(ValueError, 'CityGML 2.0'):
            self.read('<CityModel xmlns="http://www.opengis.net/citygml/3.0"/>')
        with self.assertRaisesRegex(ValueError, 'Malformed CityGML'):
            self.read(document([building()])[:-20])

    def test_limit_and_incremental_reads(self):
        xml = document([building(bid=f'b{i}') for i in range(100)])
        self.assertEqual(len(self.read(xml, 2)), 2)
        self.assertEqual(self.read(xml, 0), [])
        with self.assertRaises(ValueError):
            self.read(xml, -1)
        # A malformed tail does not prevent earlier records from being yielded.
        self.path.write_text(xml[:-12] + '<broken>')
        reader = iter_buildings(self.path, 1)
        self.assertEqual(next(reader).id, 'b0')
        reader.close()
        # Verify completed XML members are removed instead of accumulating.
        self.path.write_text(document([building(bid=f'b{i}') for i in range(500)]))
        original = ET.iterparse
        retained = []
        def monitor(*args, **kwargs):
            root = None
            for event, elem in original(*args, **kwargs):
                if root is None and event == 'start':
                    root = elem
                yield event, elem
                if event == 'end' and elem.tag.endswith('}cityObjectMember'):
                    retained.append(len(root))
        with patch('gismo_2026_fall_hackathon.citygml.ET.iterparse', monitor):
            count = sum(1 for _ in iter_buildings(self.path))
        self.assertEqual(count, 500)
        self.assertLess(max(retained), 100)  # parser read-ahead is bounded


if __name__ == '__main__':
    unittest.main()
