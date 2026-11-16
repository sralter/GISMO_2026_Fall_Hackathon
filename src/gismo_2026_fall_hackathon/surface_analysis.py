"""Surface measurements and linked 2D layers; no solar model or geometry repair."""
from collections import defaultdict
from dataclasses import dataclass
from hashlib import sha256
import json
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from pyproj import CRS, Transformer
import pyvista as pv
import shapely

from .citygml import InspectionIssue
from .meshes import MeshResult


@dataclass
class SurfaceAnalysis:
    surfaces: pd.DataFrame
    roofs: gpd.GeoDataFrame
    buildings: gpd.GeoDataFrame
    mesh: pv.PolyData
    issues: list[InspectionIssue]


def _key(*values):
    return sha256(json.dumps(values, ensure_ascii=False).encode()).hexdigest()[:24]


def _shell_status(points, faces):
    """Conservative edge/winding/volume checks, not a self-intersection test."""
    edges = defaultdict(list)
    for i, face in enumerate(faces):
        for a, b in zip(face, np.roll(face, -1)):
            edges[tuple(sorted((a, b)))].append((i, int(a), int(b)))
    if any(len(e) != 2 for e in edges.values()):
        return 'unverified_open_or_nonmanifold'
    if any(e[0][1:] != e[1][1:][::-1] for e in edges.values()):
        return 'unverified_inconsistent_winding'
    neighbors = defaultdict(set)
    for e in edges.values():
        a, b = e[0][0], e[1][0]
        neighbors[a].add(b)
        neighbors[b].add(a)
    remaining = set(range(len(faces)))
    while remaining:
        pending = [remaining.pop()]
        component = []
        while pending:
            i = pending.pop()
            component.append(i)
            for j in neighbors[i] & remaining:
                remaining.remove(j)
                pending.append(j)
        triangles = points[faces[component]]
        triangles = triangles - triangles[0, 0]
        volume = np.einsum('ij,ij->i', triangles[:, 0],
                           np.cross(triangles[:, 1], triangles[:, 2])).sum() / 6
        if volume <= 1e-12:
            return 'unverified_nonpositive_shell_volume'
    return 'closed_consistent_positive_volume'


def measure_surfaces(result: MeshResult, *, dataset_id: str,
                     z_units_verified: bool = False) -> SurfaceAnalysis:
    """Measure each source polygon and build roof/ground-projection map layers.

    Areas are in m² after CRS unit conversion; tilt is plane inclination 0..90°.
    Azimuth is clockwise from TRUE north, not projected grid north. Horizontal
    surfaces have no azimuth. Direction is withheld unless the owner's mesh
    passes conservative closed-shell checks and roof/ground semantics agree.
    These checks cannot certify absence of self-intersections or nested shells.
    All physical metrics are provisional unless the caller explicitly confirms
    the mesh Z scale converts verified vertical units into horizontal units.
    """
    if not isinstance(dataset_id, str) or not dataset_id.strip():
        raise ValueError('dataset_id must identify the source file/dataset')
    mesh = result.mesh.copy(deep=True)
    if not mesh.n_cells or not mesh.is_all_triangles:
        raise ValueError('A nonempty triangle mesh is required')
    crs = CRS.from_user_input(str(mesh.field_data['source_crs'][0]))
    if not crs.is_projected or len(crs.axis_info) < 2:
        raise ValueError('A projected horizontal CRS is required')
    axes = crs.axis_info[:2]
    if [a.direction for a in axes] != ['east', 'north'] or not np.isclose(axes[0].unit_conversion_factor, axes[1].unit_conversion_factor):
        raise ValueError('Expected east/north axes with matching linear units')
    unit = axes[0].unit_conversion_factor
    z_scale = float(mesh.field_data['z_scale'][0])
    if not np.isfinite(z_scale) or z_scale <= 0:
        raise ValueError('Invalid mesh Z scale')
    origin = np.asarray(mesh.field_data['origin'], dtype=float)
    faces = mesh.faces.reshape(-1, 4)[:, 1:]
    points = np.asarray(mesh.points)
    triangles = points[faces]
    crosses = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
    magnitudes = np.linalg.norm(crosses, axis=1)
    if not np.isfinite(points).all() or not np.isfinite(magnitudes).all() or np.any(magnitudes <= 1e-12):
        raise ValueError('Mesh contains invalid or degenerate triangles')
    cell_areas = magnitudes / 2 * unit**2
    labels = pd.DataFrame({k: np.asarray(v) for k, v in mesh.cell_data.items()})
    identity = ['building_index', 'building_id', 'owner_path', 'surface_index', 'surface_id',
                'surface_kind', 'polygon_index', 'polygon_id']
    if not set(identity) <= set(labels):
        raise ValueError('Mesh is missing source identity labels')
    status = {}
    for owner, frame in labels.groupby(['building_index', 'owner_path'], sort=False):
        status[owner] = _shell_status(points, faces[frame.index])
    transformer = Transformer.from_crs(crs, crs.geodetic_crs, always_xy=True)
    geod = crs.get_geod()
    rows, roof_rows, projections = [], [], defaultdict(list)
    issues = list(result.issues)
    cell_feature = np.empty(mesh.n_cells, dtype=object)
    cell_tilt = np.full(mesh.n_cells, np.nan)
    cell_azimuth = np.full(mesh.n_cells, np.nan)
    cell_status = np.empty(mesh.n_cells, dtype=object)
    for values, group in labels.groupby(identity, sort=False, dropna=False):
        row = dict(zip(identity, values))
        ids = group.index.to_numpy()
        # Prefer persistent source IDs; indices are a fallback for missing IDs.
        building_key = _key(dataset_id, row['building_id'] or f"index:{row['building_index']}")
        feature_key = _key(building_key, row['owner_path'], row['surface_id'] or f"index:{row['surface_index']}",
                           row['polygon_id'] or f"index:{row['polygon_index']}")
        normal = crosses[ids].sum(axis=0)
        normal_length = np.linalg.norm(normal)
        if normal_length <= 1e-12:
            raise ValueError('Source polygon triangles have cancelling normals')
        normal /= normal_length
        tilt = np.degrees(np.arccos(np.clip(abs(normal[2]), 0, 1)))
        spread = np.degrees(np.arccos(np.clip((crosses[ids] / magnitudes[ids, None]) @ normal, -1, 1))).max()
        direction_status = status[(row['building_index'], row['owner_path'])]
        kind = row['surface_kind']
        if (kind == 'RoofSurface' and normal[2] <= 0) or (kind == 'GroundSurface' and normal[2] >= 0):
            direction_status = 'unverified_semantic_direction'
        if spread > 0.1:
            direction_status = 'unverified_normal_spread'
        azimuth = np.nan
        horizontal_length = np.linalg.norm(normal[:2])
        if horizontal_length > 1e-8 and direction_status == 'closed_consistent_positive_volume':
            center = np.average(triangles[ids].mean(axis=1), axis=0, weights=cell_areas[ids]) + origin
            end = center[:2] + normal[:2] / horizontal_length * (10 / unit)
            lon, lat = transformer.transform([center[0], end[0]], [center[1], end[1]])
            azimuth = geod.inv(lon[0], lat[0], lon[1], lat[1])[0] % 360
        projected = []
        for triangle in triangles[ids] + origin:
            shape = shapely.Polygon(triangle[:, :2])
            if shape.area > 1e-12:
                projected.append(shape)
        geometry = shapely.union_all(projected) if projected else None
        projected_area = 0.0 if geometry is None else geometry.area * unit**2
        row.update(dataset_id=dataset_id, building_key=building_key, feature_key=feature_key,
                   area_m2=float(cell_areas[ids].sum()), projected_area_m2=projected_area,
                   tilt_deg=float(tilt), azimuth_true_deg=float(azimuth),
                   normal_x=float(normal[0]), normal_y=float(normal[1]), normal_z=float(normal[2]),
                   normal_spread_deg=float(spread), normal_status=direction_status,
                   measurements_provisional=not z_units_verified, z_scale=z_scale, triangle_count=len(ids),
                   source_has_extraction_issues=bool(result.issues))
        rows.append(row)
        if direction_status != 'closed_consistent_positive_volume':
            issues.append(InspectionIssue(feature_key, f'Azimuth withheld: {direction_status}'))
        if kind == 'RoofSurface' and geometry is not None:
            roof_rows.append(dict(row, geometry=geometry))
        if kind in {'GroundSurface', 'RoofSurface'} and geometry is not None:
            projections[(building_key, kind)].append(geometry)
        cell_feature[ids] = feature_key
        cell_tilt[ids] = tilt
        cell_azimuth[ids] = azimuth
        cell_status[ids] = direction_status
    surfaces = pd.DataFrame(rows)
    if not surfaces.feature_key.is_unique:
        raise ValueError('Duplicate source identities produce ambiguous feature keys')
    building_rows = []
    for key, group in surfaces.groupby('building_key', sort=False):
        first = group.iloc[0]
        ground = projections[(key, 'GroundSurface')]
        roof = projections[(key, 'RoofSurface')]
        geometry = shapely.union_all(ground) if ground else None
        building_rows.append(dict(dataset_id=dataset_id, building_key=key,
            building_id=first.building_id, building_index=int(first.building_index),
            footprint_status='ground_projection' if ground else 'missing_ground_geometry',
            footprint_area_m2=geometry.area * unit**2 if geometry is not None else np.nan,
            roof_area_m2=group.loc[group.surface_kind == 'RoofSurface', 'area_m2'].sum(),
            roof_projected_area_m2=shapely.union_all(roof).area * unit**2 if roof else 0.0,
            measurements_provisional=not z_units_verified, z_scale=z_scale,
            source_has_extraction_issues=bool(result.issues),
            orientation_flag_count=sum(i.context in set(group.feature_key) for i in issues), geometry=geometry))
    roof_columns = [*surfaces.columns, 'geometry']
    roofs = gpd.GeoDataFrame(roof_rows, columns=roof_columns, geometry='geometry', crs=crs)
    buildings = gpd.GeoDataFrame(building_rows, geometry='geometry', crs=crs)
    mesh.cell_data['feature_key'] = np.asarray(cell_feature, dtype=str)
    mesh.cell_data['area_m2'] = cell_areas
    mesh.cell_data['tilt_deg'] = cell_tilt
    mesh.cell_data['azimuth_true_deg'] = cell_azimuth
    mesh.cell_data['normal_status'] = np.asarray(cell_status, dtype=str)
    mesh.field_data['dataset_id'] = np.array([dataset_id])
    mesh.field_data['measurements_provisional'] = np.array([int(not z_units_verified)])
    return SurfaceAnalysis(surfaces, roofs, buildings, mesh, issues)


def export_layers(analysis: SurfaceAnalysis, directory: str | Path) -> Path:
    """Write linked GIS/browser/mesh assets into a NEW directory; never overwrite."""
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=False)
    for name, frame in [('buildings', analysis.buildings), ('roofs', analysis.roofs)]:
        if frame.empty:
            continue
        frame.to_file(directory / 'layers.gpkg', layer=name, driver='GPKG', index=False)
        frame.to_crs('EPSG:4326').to_file(directory / f'{name}.geojson', driver='GeoJSON', index=False)
    analysis.surfaces.to_csv(directory / 'surfaces.csv', index=False)
    pd.DataFrame([vars(i) for i in analysis.issues], columns=['context', 'message']).to_csv(directory / 'issues.csv', index=False)
    analysis.mesh.save(directory / 'surfaces.vtp')
    return directory
