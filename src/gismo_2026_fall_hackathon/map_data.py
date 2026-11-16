"""Browser-ready data derived from the shared analysis pipeline."""
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse
import re

import geopandas as gpd
import numpy as np
import pandas as pd
from pyproj import CRS, Transformer

from .citygml import iter_buildings
from .meshes import buildings_to_mesh
from .surface_analysis import measure_surfaces

TYPE_COLORS = {'RoofSurface': [198, 73, 58], 'WallSurface': [114, 155, 189],
               'GroundSurface': [72, 132, 88], 'ClosureSurface': [153, 106, 173],
               'OuterCeilingSurface': [210, 151, 49], 'OuterFloorSurface': [112, 119, 126]}


@dataclass
class DisplaySample:
    buildings: gpd.GeoDataFrame
    roofs: gpd.GeoDataFrame
    surfaces: pd.DataFrame
    triangles: pd.DataFrame
    issues: pd.DataFrame
    source: str


def slide_embed_url(value: str) -> str | None:
    """Accept Google Slides links only; never pass arbitrary input HTML to an iframe."""
    parsed = urlparse(value.strip())
    if parsed.scheme != 'https' or parsed.netloc != 'docs.google.com':
        return None
    match = re.fullmatch(r'/presentation/d/(e/)?([A-Za-z0-9_-]+)(?:/(?:edit|preview|embed|pubembed|pub))?/?', parsed.path)
    if not match:
        return None
    published, identifier = match.groups()
    path = f'e/{identifier}/pubembed' if published else f'{identifier}/embed'
    return f'https://docs.google.com/presentation/d/{path}?start=false&loop=false&delayms=60000'


def inclination_color(tilt: float) -> list[int]:
    fraction = np.clip(float(tilt) / 90, 0, 1)
    return np.rint(np.array([32, 145, 140]) * (1-fraction) + np.array([239, 174, 67]) * fraction).astype(int).tolist()


def load_display_sample(path: str | Path, limit: int, z_scale: float) -> DisplaySample:
    """Read a bounded sample; 3D heights are metres ABOVE THE SAMPLE BASE.

    This relative rendering altitude is not an ellipsoidal or terrain elevation.
    The caller still has to label the configured vertical scale as provisional.
    """
    if isinstance(limit, bool) or not isinstance(limit, int) or not 1 <= limit <= 100:
        raise ValueError('Choose between 1 and 100 buildings for the interactive sample')
    path = Path(path)
    records = list(iter_buildings(path, limit=limit))
    result = buildings_to_mesh(records, z_scale=z_scale)
    analysis = measure_surfaces(result, dataset_id=path.name)
    mesh = analysis.mesh
    crs = CRS.from_user_input(str(mesh.field_data['source_crs'][0]))
    factor = crs.axis_info[0].unit_conversion_factor
    xyz = mesh.points.copy() + mesh.field_data['origin']
    lon, lat = Transformer.from_crs(crs, 'EPSG:4326', always_xy=True).transform(xyz[:, 0], xyz[:, 1])
    positions = np.column_stack([lon, lat, mesh.points[:, 2] * factor])
    faces = mesh.faces.reshape(-1, 4)[:, 1:]
    table = pd.DataFrame({k: np.asarray(v) for k, v in mesh.cell_data.items()})
    measured = analysis.surfaces.set_index('feature_key')
    triangles = []
    for i, (_, row) in enumerate(table.iterrows()):
        metric = measured.loc[row.feature_key]
        triangles.append(dict(polygon=positions[faces[i]].tolist(), building_key=metric.building_key,
            building_id=str(row.building_id), feature_key=row.feature_key,
            surface_kind=row.surface_kind, tilt_deg=round(float(row.tilt_deg), 2),
            area_m2=round(float(metric.area_m2), 2), normal_status=row.normal_status,
            type_color=TYPE_COLORS.get(row.surface_kind, [130, 130, 130]),
            inclination_color=inclination_color(row.tilt_deg)))
    buildings = analysis.buildings.to_crs('EPSG:4326')
    buildings['name'] = [records[int(i)].name or records[int(i)].id or f'Building {i}' for i in buildings.building_index]
    buildings['BIN'] = [records[int(i)].metadata.get('BIN', '') for i in buildings.building_index]
    buildings['label'] = [f'{name} · BIN {bin_id}' if bin_id else name for name, bin_id in zip(buildings['name'], buildings['BIN'])]
    roofs = analysis.roofs.to_crs('EPSG:4326')
    roofs['type_color'] = [TYPE_COLORS['RoofSurface']] * len(roofs)
    roofs['inclination_color'] = [inclination_color(t) for t in roofs.tilt_deg]
    return DisplaySample(buildings, roofs, analysis.surfaces, pd.DataFrame(triangles),
                         pd.DataFrame([vars(i) for i in analysis.issues], columns=['context', 'message']), path.name)
