"""Triangulate labeled CityGML polygons, keeping source identity on every cell."""
from dataclasses import dataclass
from collections.abc import Iterable

import numpy as np
import pyvista as pv
import shapely
from pyproj import CRS

from .citygml import Building, Polygon, InspectionIssue


@dataclass
class MeshResult:
    mesh: pv.PolyData
    issues: list[InspectionIssue]


def _triangles(polygon: Polygon, z_scale: float, tolerance: float) -> np.ndarray:
    """Project onto a local plane to support vertical faces, concavity and holes."""
    rings = []
    for ring in [polygon.exterior, *polygon.interiors]:
        xyz = np.array(ring, dtype=float, copy=True)
        if xyz.ndim != 2 or xyz.shape[1] != 3 or len(xyz) < 4 or not np.isfinite(xyz).all():
            raise ValueError("Invalid finite XYZ ring")
        if not np.allclose(xyz[0], xyz[-1], rtol=0, atol=1e-7):
            raise ValueError("Unclosed ring")
        xyz[:, 2] *= z_scale
        rings.append(xyz[:-1])
    exterior = rings[0]
    anchor = exterior[0]
    centered = exterior - anchor
    # Newell's normal preserves the source exterior's winding.
    normal = np.cross(centered, np.roll(centered, -1, axis=0)).sum(axis=0)
    length = np.linalg.norm(normal)
    if length <= 1e-12:
        raise ValueError("Degenerate exterior normal")
    normal /= length
    edges = np.roll(exterior, -1, axis=0) - exterior
    u = edges[np.argmax(np.linalg.norm(edges, axis=1))]
    u = u - np.dot(u, normal) * normal
    if np.linalg.norm(u) <= 1e-12:
        raise ValueError("Degenerate plane basis")
    u /= np.linalg.norm(u)
    v = np.cross(normal, u)
    all_xyz = np.vstack(rings)
    residual = np.abs((all_xyz - anchor) @ normal).max()
    if residual > tolerance:
        raise ValueError(f"Nonplanar polygon: deviation {residual:.6g} exceeds {tolerance:g} source XY units")
    basis = np.column_stack([u, v])
    projected = [(ring - anchor) @ basis for ring in rings]
    shape = shapely.Polygon(projected[0], projected[1:])
    if not shape.is_valid or shape.area <= 1e-12:
        raise ValueError(f"Invalid projected polygon: {shapely.is_valid_reason(shape)}")
    triangles = list(shapely.constrained_delaunay_triangles(shape).geoms)
    if not triangles or not np.isclose(sum(t.area for t in triangles), shape.area, rtol=1e-8, atol=1e-9):
        raise ValueError("Triangulation did not preserve polygon area")
    # Constrained triangulation uses input vertices. Map them back exactly rather
    # than flattening the source coordinates onto the projection plane.
    lookup = {}
    for xy_ring, xyz_ring in zip(projected, rings):
        for xy, xyz in zip(xy_ring, xyz_ring):
            key = tuple(xy)
            if key in lookup and not np.allclose(lookup[key], xyz, rtol=0, atol=1e-9):
                raise ValueError("Different XYZ vertices project to the same point")
            lookup[key] = xyz
    result = []
    for triangle in triangles:
        if not shape.covers(triangle):
            raise ValueError("Triangle crosses polygon boundary or hole")
        try:
            xyz = np.array([lookup[tuple(xy)] for xy in np.asarray(triangle.exterior.coords)[:3]])
        except KeyError as exc:
            raise ValueError("Triangulation introduced an unmapped vertex") from exc
        cross = np.cross(xyz[1] - xyz[0], xyz[2] - xyz[0])
        if np.linalg.norm(cross) <= 1e-12:
            raise ValueError("Degenerate triangle")
        if np.dot(cross, normal) < 0:
            xyz = xyz[[0, 2, 1]]
        result.append(xyz)
    return np.array(result)


def buildings_to_mesh(buildings: Iterable[Building], *, z_scale: float,
                      planarity_tolerance: float = 0.01) -> MeshResult:
    """Build a triangle surface mesh in local source-XY units.

    z_scale is REQUIRED: source Z multiplied by it must match the horizontal
    unit. Passing 1 explicitly assumes matching source XYZ units. No vertical
    datum is inferred. Planarity tolerance is in horizontal coordinate units.
    Source winding is preserved, not certified as outward. Invalid polygons are
    skipped with issues; parse issues from all buildings/parts are also retained.

    Points = scaled source XYZ minus field_data['origin']. Recover source XYZ by
    adding origin, then dividing Z by field_data['z_scale']. No reprojection,
    smoothing, hole filling, or watertightness repair is performed.
    """
    if not np.isfinite(z_scale) or z_scale <= 0:
        raise ValueError("z_scale must be finite and positive")
    if not np.isfinite(planarity_tolerance) or planarity_tolerance < 0:
        raise ValueError("planarity_tolerance must be finite and nonnegative")
    vertices, labels, issues = [], [], []
    source_crs = None
    source_crs_text = None

    def walk(records):
        for record in records:
            yield record
            yield from walk(record.parts)

    for building_index, building in enumerate(buildings):
        for owner in walk([building]):
            issues.extend(owner.issues)
            for surface_index, surface in enumerate(owner.surfaces):
                for polygon_index, polygon in enumerate(surface.polygons):
                    context = f"building[{building_index}]/{'/'.join(surface.owner_path)}/surface[{surface_index}]/polygon[{polygon_index}]"
                    # Mixing coordinate systems would corrupt the entire scene.
                    crs = CRS.from_user_input(polygon.crs)
                    if not crs.is_projected or len(crs.axis_info) < 2:
                        raise ValueError("Mesh input requires a projected horizontal CRS")
                    if source_crs is None:
                        source_crs, source_crs_text = crs, polygon.crs
                    elif crs != source_crs:
                        raise ValueError("Mixed source CRS: reproject before combining meshes")
                    try:
                        triangles = _triangles(polygon, z_scale, planarity_tolerance)
                    except (ValueError, shapely.errors.GEOSException) as exc:
                        issues.append(InspectionIssue(context, f"Excluded mesh polygon: {exc}"))
                        continue
                    vertices.extend(triangles)
                    labels.extend([{
                        "building_index": building_index,
                        "building_id": building.id or "",
                        "owner_id": owner.id or "",
                        "owner_path": "/".join(surface.owner_path),
                        "surface_index": surface_index,
                        "surface_id": surface.id or "",
                        "surface_kind": surface.kind,
                        "polygon_index": polygon_index,
                        "polygon_id": polygon.id or "",
                    }] * len(triangles))
    mesh = pv.PolyData()
    origin = np.zeros(3)
    if vertices:
        points = np.array(vertices).reshape(-1, 3)
        origin = points.min(axis=0)
        # Exact duplicate vertices share indices; nearby vertices are not snapped.
        points, inverse = np.unique(points - origin, axis=0, return_inverse=True)
        faces = np.column_stack([np.full(len(labels), 3), inverse.reshape(-1, 3)])
        mesh = pv.PolyData(points, faces)
        for key in labels[0]:
            mesh.cell_data[key] = np.array([label[key] for label in labels])
    mesh.field_data['origin'] = origin
    mesh.field_data['z_scale'] = np.array([z_scale])
    mesh.field_data['source_crs'] = np.array([source_crs_text or ''])
    mesh.field_data['coordinate_note'] = np.array(['Local source XY units; Z scaled explicitly; vertical datum unverified'])
    return MeshResult(mesh, issues)
