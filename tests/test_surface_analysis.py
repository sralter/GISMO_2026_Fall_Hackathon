import json
from pathlib import Path
import tempfile
import unittest

import geopandas as gpd
import numpy as np
from pyproj import Transformer
import pyvista as pv

from gismo_2026_fall_hackathon.citygml import Building, Surface, Polygon
from gismo_2026_fall_hackathon.meshes import buildings_to_mesh
from gismo_2026_fall_hackathon.surface_analysis import measure_surfaces, export_layers


def box(reverse=False, omit_wall=False, offset=0):
    points = np.array([(0,0,0),(1,0,0),(1,1,0),(0,1,0),
                       (0,0,1),(1,0,1),(1,1,1),(0,1,1)],dtype=float)
    # Metre CRS at the central meridian, where grid and true north agree.
    points += [500000+offset, 4500000, 0]
    quads = [[0,3,2,1,0],[4,5,6,7,4],[0,1,5,4,0],[1,2,6,5,1],
             [2,3,7,6,2],[3,0,4,7,3]]
    kinds = ['GroundSurface','RoofSurface'] + ['WallSurface']*4
    surfaces=[]
    for i,(quad,kind) in enumerate(zip(quads,kinds)):
        if omit_wall and i==5: continue
        if reverse: quad=list(reversed(quad))
        p=Polygon(None,points[quad],[],'EPSG:32618',3)
        surfaces.append(Surface(str(i),kind,('b',),{},[p]))
    return Building('b','test','Building',{},surfaces)


def analyze(b=None, verified=False):
    return measure_surfaces(buildings_to_mesh([b or box()],z_scale=1),dataset_id='fixture',z_units_verified=verified)


class AnalysisTests(unittest.TestCase):
    def test_cube_units_tilt_directions_and_linkage(self):
        a=analyze()
        self.assertAlmostEqual(a.surfaces.area_m2.sum(),6)
        self.assertAlmostEqual(a.buildings.footprint_area_m2.iloc[0],1)
        roof=a.surfaces[a.surfaces.surface_kind=='RoofSurface'].iloc[0]
        self.assertAlmostEqual(roof.tilt_deg,0)
        self.assertTrue(np.isnan(roof.azimuth_true_deg))
        walls=a.surfaces[a.surfaces.surface_kind=='WallSurface']
        np.testing.assert_allclose(walls.tilt_deg,90)
        for got,want in zip(walls.azimuth_true_deg,[180,90,0,270]):
            self.assertLess(abs((got-want+180)%360-180),0.001)
        self.assertTrue((a.surfaces.normal_status=='closed_consistent_positive_volume').all())
        self.assertTrue(a.surfaces.measurements_provisional.all())
        self.assertFalse(analyze(verified=True).surfaces.measurements_provisional.any())
        self.assertEqual(set(a.mesh['feature_key']),set(a.surfaces.feature_key))
        self.assertTrue(a.roofs.geometry.is_valid.all())
        self.assertFalse(a.roofs.geometry.has_z.any())

    def test_open_or_reversed_shell_withholds_azimuth(self):
        for b in [box(omit_wall=True),box(reverse=True)]:
            a=analyze(b)
            self.assertTrue(a.surfaces.azimuth_true_deg.isna().all())
            self.assertTrue(a.surfaces.normal_status.str.startswith('unverified').all())
            self.assertTrue(a.issues)
            self.assertAlmostEqual(a.buildings.footprint_area_m2.iloc[0],1)

    def test_hole_sloped_roof_and_missing_ground(self):
        # A roof tilted 45 degrees in a metric CRS. No solid, so azimuth withheld.
        exterior=np.array([(0,0,0),(4,0,4),(4,4,4),(0,4,0),(0,0,0)],float)
        hole=np.array([(1,1,1),(1,3,1),(3,3,3),(3,1,3),(1,1,1)],float)
        exterior[:,:2]+=[500000,4500000]; hole[:,:2]+=[500000,4500000]
        p=Polygon(None,exterior,[hole],'EPSG:32618',3)
        b=Building('b',None,'Building',{},[Surface('roof','RoofSurface',('b',),{},[p])])
        a=analyze(b)
        self.assertAlmostEqual(a.surfaces.area_m2.iloc[0],12*np.sqrt(2))
        self.assertAlmostEqual(a.surfaces.tilt_deg.iloc[0],45)
        self.assertAlmostEqual(a.roofs.geometry.area.iloc[0],12)
        self.assertTrue(a.buildings.geometry.isna().all())
        self.assertEqual(a.buildings.footprint_status.iloc[0],'missing_ground_geometry')

    def test_feet_conversion_and_true_north(self):
        b=box()
        for s in b.surfaces:
            p=s.polygons[0]
            p.crs='EPSG:2263'
            p.exterior[:,:2] += [500000,-4300000]
        a=analyze(b)
        factor=1200/3937
        self.assertAlmostEqual(a.surfaces.area_m2.sum(),6*factor**2)
        self.assertAlmostEqual(a.buildings.footprint_area_m2.iloc[0],factor**2)
        # At this NYC location grid north differs measurably from true north.
        north=a.surfaces[a.surfaces.surface_id=='4'].iloc[0]
        self.assertGreater(min(north.azimuth_true_deg,360-north.azimuth_true_deg),0.01)

    def test_exports_and_no_overwrite(self):
        a=analyze()
        with tempfile.TemporaryDirectory() as temp:
            out=export_layers(a,Path(temp)/'outputs')
            self.assertEqual(set(gpd.list_layers(out/'layers.gpkg')['name']),{'buildings','roofs'})
            buildings=gpd.read_file(out/'layers.gpkg',layer='buildings')
            self.assertEqual(buildings.crs.to_epsg(),32618)
            data=json.loads((out/'buildings.geojson').read_text())
            coords=data['features'][0]['geometry']['coordinates'][0][0]
            self.assertTrue(-80<coords[0]<-70 and 35<coords[1]<45)
            roof=gpd.read_file(out/'roofs.geojson')
            self.assertEqual(roof.feature_key.iloc[0],a.roofs.feature_key.iloc[0])
            loaded=pv.read(out/'surfaces.vtp')
            self.assertEqual(set(loaded['feature_key']),set(a.surfaces.feature_key))
            with self.assertRaises(FileExistsError): export_layers(a,out)

    def test_stable_keys_and_input_not_modified(self):
        result=buildings_to_mesh([box()],z_scale=1)
        a=measure_surfaces(result,dataset_id='fixture')
        self.assertNotIn('area_m2',result.mesh.cell_data)
        b=measure_surfaces(result,dataset_id='fixture')
        self.assertEqual(a.surfaces.feature_key.tolist(),b.surfaces.feature_key.tolist())
        with self.assertRaises(ValueError): measure_surfaces(result,dataset_id='')


if __name__=='__main__': unittest.main()
