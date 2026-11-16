from pathlib import Path
import unittest
from unittest.mock import patch

import numpy as np

from gismo_2026_fall_hackathon.map_data import load_display_sample, slide_embed_url
from test_surface_analysis import box


def display_sample():
    with patch('gismo_2026_fall_hackathon.map_data.iter_buildings',return_value=iter([box()])):
        return load_display_sample(Path('fixture.gml'),25,1)


class MapDataTests(unittest.TestCase):
    def test_vertical_faces_heights_and_source_linkage(self):
        sample=display_sample()
        positions=np.array(sample.triangles.polygon.tolist())
        self.assertEqual(positions.shape[1:],(3,3))
        self.assertAlmostEqual(positions[:,:,2].min(),0)
        self.assertAlmostEqual(positions[:,:,2].max(),1)
        self.assertTrue(np.all((-80 < positions[:,:,0]) & (positions[:,:,0] < -70)))
        self.assertEqual(set(sample.triangles.feature_key),set(sample.surfaces.feature_key))
        walls=sample.triangles[sample.triangles.surface_kind=='WallSurface']
        self.assertFalse(walls.empty)
        self.assertTrue(all(np.ptp(np.array(p)[:,2]) > 0 for p in walls.polygon))
        self.assertEqual(sample.buildings.crs.to_epsg(),4326)
        self.assertTrue(sample.surfaces.measurements_provisional.all())

    def test_only_google_slides_links_are_embedded(self):
        self.assertEqual(slide_embed_url('https://docs.google.com/presentation/d/deck_123/edit#slide=id.p'),
            'https://docs.google.com/presentation/d/deck_123/embed?start=false&loop=false&delayms=60000')
        self.assertIn('/d/e/published/pubembed?',slide_embed_url('https://docs.google.com/presentation/d/e/published/pubembed'))
        for bad in ['<script>alert(1)</script>','javascript:alert(1)','https://evil.example/deck',
                    'https://docs.google.com.evil.example/presentation/d/deck/edit',
                    'http://docs.google.com/presentation/d/deck/edit','/report.html']:
            with self.subTest(bad=bad): self.assertIsNone(slide_embed_url(bad))

    def test_interactive_sample_is_bounded(self):
        for size in [0,101,True]:
            with self.assertRaises(ValueError): load_display_sample('missing.gml',size,1)


if __name__=='__main__': unittest.main()
