import tempfile
from pathlib import Path
import unittest

import numpy as np
import pyvista as pv
from shapely import Polygon as Shape

from gismo_2026_fall_hackathon.citygml import Building, Surface, Polygon, InspectionIssue
from gismo_2026_fall_hackathon.meshes import buildings_to_mesh


def poly(xy, holes=(), vertical=False):
    def xyz(ring):
        return np.array([(x, 0, y) if vertical else (x, y, 5) for x, y in ring], dtype=float)
    return Polygon('p', xyz(xy), [xyz(h) for h in holes], 'EPSG:2263', 3)


def building(p):
    return Building('b', 'example', 'Building', {'BIN': '001'},
                    [Surface('s', 'RoofSurface', ('b',), {}, [p])])

SQUARE = [(0,0),(4,0),(4,4),(0,4),(0,0)]


class MeshTests(unittest.TestCase):
    def test_hole_area_and_face_identity(self):
        hole = [(1,1),(1,3),(3,3),(3,1),(1,1)]
        result = buildings_to_mesh([building(poly(SQUARE, [hole]))], z_scale=1)
        mesh = result.mesh
        self.assertFalse(result.issues)
        self.assertAlmostEqual(mesh.area, 12)
        self.assertTrue(mesh.is_all_triangles)
        self.assertTrue(np.all(mesh.cell_data['surface_id'] == 's'))
        for face in mesh.faces.reshape(-1,4)[:,1:]:
            source = mesh.points[face] + mesh.field_data['origin']
            self.assertTrue(Shape(SQUARE, [hole]).covers(Shape(source[:,:2])))

    def test_concavity_vertical_and_winding(self):
        ring = [(0,0),(4,0),(4,1),(1,1),(1,4),(0,4),(0,0)]
        for vertical in [False,True]:
            for coords in [ring,list(reversed(ring))]:
                p = poly(coords, vertical=vertical)
                result = buildings_to_mesh([building(p)], z_scale=1)
                self.assertFalse(result.issues)
                self.assertAlmostEqual(result.mesh.area, 7)
                src = p.exterior[:-1]
                normal = np.cross(src-src[0], np.roll(src-src[0],-1,axis=0)).sum(axis=0)
                tris = result.mesh.points[result.mesh.faces.reshape(-1,4)[:,1:]]
                normals = np.cross(tris[:,1]-tris[:,0], tris[:,2]-tris[:,0])
                self.assertTrue(np.all(normals @ normal > 0))

    def test_scale_and_coordinate_recovery(self):
        p = poly(SQUARE, vertical=True)
        p.exterior[:,0] += 1_000_000
        b = building(p)
        mesh = buildings_to_mesh([b], z_scale=2).mesh
        self.assertAlmostEqual(mesh.area, 32)
        recovered = mesh.points + mesh.field_data['origin']
        recovered[:,2] /= 2
        self.assertEqual(set(map(tuple,recovered)), set(map(tuple,p.exterior)))
        self.assertEqual(p.exterior[0,0], 1_000_000)  # source not mutated

    def test_invalid_polygons_and_parse_issues(self):
        for p in [poly([(0,0),(2,2),(0,2),(2,0),(0,0)]), poly(SQUARE)]:
            if p.exterior[1,0] == 4:
                p.exterior[1,2] += 1
            b = building(p)
            b.issues.append(InspectionIssue('b', 'parse flag'))
            result = buildings_to_mesh([b], z_scale=1)
            self.assertEqual(result.mesh.n_cells, 0)
            self.assertEqual(len(result.issues),2)
        for scale in [0, float('nan'), -1]:
            with self.assertRaises(ValueError): buildings_to_mesh([],z_scale=scale)

    def test_parts_mixed_crs_and_vtp_roundtrip(self):
        b = building(poly(SQUARE))
        b.parts.append(Building('part',None,'BuildingPart',{},
                               [Surface('part-s','WallSurface',('b','part'),{},[poly(SQUARE,vertical=True)])]))
        result = buildings_to_mesh([b],z_scale=1)
        self.assertIn('part',result.mesh.cell_data['owner_id'])
        with tempfile.TemporaryDirectory() as d:
            p = Path(d)/'mesh.vtp'
            result.mesh.save(p)
            loaded = pv.read(p)
            np.testing.assert_equal(loaded.cell_data['surface_id'],result.mesh.cell_data['surface_id'])
            np.testing.assert_allclose(loaded.field_data['origin'], result.mesh.field_data['origin'])
        other = building(poly(SQUARE))
        other.surfaces[0].polygons[0].crs='EPSG:3857'
        with self.assertRaisesRegex(ValueError,'Mixed source CRS'):
            buildings_to_mesh([b,other],z_scale=1)
        self.assertEqual(buildings_to_mesh([],z_scale=1).mesh.n_cells,0)


if __name__ == '__main__':
    unittest.main()
