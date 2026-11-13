"""Bounded-memory inspection reader for NYC's CityGML 2.0 polygon surfaces.

Coordinates are preserved, not reprojected or repaired. Horizontal CRS declarations
must not be interpreted as proof of vertical units or datum.
"""
from dataclasses import dataclass, field
from pathlib import Path
from collections.abc import Iterator
import xml.etree.ElementTree as ET

import numpy as np

NS = {"core": "http://www.opengis.net/citygml/2.0",
      "bldg": "http://www.opengis.net/citygml/building/2.0",
      "gml": "http://www.opengis.net/gml",
      "gen": "http://www.opengis.net/citygml/generics/2.0"}
GML_ID = f"{{{NS['gml']}}}id"
HREF = "{http://www.w3.org/1999/xlink}href"
SURFACES = {"RoofSurface", "WallSurface", "GroundSurface", "ClosureSurface",
            "OuterCeilingSurface", "OuterFloorSurface"}
UNSUPPORTED_GEOMETRY = {"Solid", "CompositeSolid", "MultiSolid", "Surface", "CompositeSurface",
                        "OrientableSurface", "TriangulatedSurface", "Triangle", "Tin",
                        "Point", "MultiPoint", "LineString", "Curve", "MultiCurve",
                        "ImplicitGeometry", "Rectangle", "PolygonPatch"}


def _tag(prefix: str, name: str) -> str:
    return f"{{{NS[prefix]}}}{name}"


@dataclass
class InspectionIssue:
    context: str
    message: str


@dataclass
class Polygon:
    id: str | None
    exterior: np.ndarray
    interiors: list[np.ndarray]
    crs: str
    dimension: int


@dataclass
class Surface:
    id: str | None
    kind: str
    owner_path: tuple[str, ...]
    metadata: dict[str, str | None]
    polygons: list[Polygon] = field(default_factory=list)


@dataclass
class Building:
    id: str | None
    name: str | None
    kind: str
    metadata: dict[str, str | None]
    surfaces: list[Surface] = field(default_factory=list)
    parts: list['Building'] = field(default_factory=list)
    issues: list[InspectionIssue] = field(default_factory=list)


def _metadata(element: ET.Element) -> dict[str, str | None]:
    return {child.get("name", "(unnamed)"): child.findtext("gen:value", namespaces=NS)
            for child in element
            if child.tag.startswith(f"{{{NS['gen']}}}") and child.tag.endswith("Attribute")}


def _owned_nodes(element: ET.Element) -> Iterator[ET.Element]:
    """Visit an owner's subtree without absorbing the contents of its parts."""
    yield element
    for child in element:
        if child.tag == _tag("bldg", "BuildingPart"):
            yield child
        else:
            yield from _owned_nodes(child)


def _parse_building(element, parents, inherited, path=()):
    building = Building(element.get(GML_ID), element.findtext("gml:name", namespaces=NS),
                        element.tag.rsplit("}", 1)[-1], _metadata(element))
    # Missing source IDs remain None; only the diagnostic path gets a fallback.
    owner_path = path + (building.id or f"{building.kind}[missing-id]",)
    if building.id is None:
        building.issues.append(InspectionIssue("/".join(owner_path), "Missing gml:id"))
    nodes = list(_owned_nodes(element))
    for node in nodes:
        context = node.get(GML_ID) or "/".join(owner_path)
        name = node.tag.rsplit("}", 1)[-1]
        if HREF in node.attrib:
            building.issues.append(InspectionIssue(context, f"Unresolved geometry/reference: {node.get(HREF)}"))
        if node.tag.startswith(f"{{{NS['gml']}}}"):
            if name in {"pos", "coordinates", "coord"}:
                building.issues.append(InspectionIssue(context, f"Unsupported coordinate encoding: {name}"))
            elif name in UNSUPPORTED_GEOMETRY:
                building.issues.append(InspectionIssue(context, f"Unsupported geometry: {name}"))
        if node is not element and node.tag == _tag("bldg", "BuildingPart"):
            building.parts.append(_parse_building(node, parents, inherited, owner_path))
        if node.tag not in {_tag("bldg", s) for s in SURFACES}:
            continue
        surface = Surface(node.get(GML_ID), name, owner_path, _metadata(node))
        building.surfaces.append(surface)
        context = surface.id or f"{'/'.join(owner_path)}/{name}"
        polygon_nodes = list(node.iter(_tag("gml", "Polygon")))
        if not polygon_nodes:
            building.issues.append(InspectionIssue(context, "Surface has no inline Polygon"))
        for polygon in polygon_nodes:
            polygon_context = polygon.get(GML_ID) or context
            try:
                exterior_nodes = polygon.findall("gml:exterior/gml:LinearRing", NS)
                if len(exterior_nodes) != 1:
                    raise ValueError("Polygon requires exactly one inline exterior LinearRing")
                interior_wrappers = polygon.findall("gml:interior", NS)
                interior_nodes = polygon.findall("gml:interior/gml:LinearRing", NS)
                if len(interior_nodes) != len(interior_wrappers):
                    raise ValueError("Interior boundary requires one inline LinearRing")
                arrays, crs_values = [], []
                for ring in exterior_nodes + interior_nodes:
                    positions = ring.findall("gml:posList", NS)
                    if len(positions) != 1:
                        raise ValueError("Ring requires one inline posList")
                    pos = positions[0]
                    dimension = inherited(pos, "srsDimension")
                    if dimension != "3":
                        raise ValueError(f"Expected declared XYZ dimension 3, got {dimension!r}")
                    crs = inherited(pos, "srsName")
                    if not crs:
                        raise ValueError("Missing CRS declaration")
                    values = np.array([float(v) for v in (pos.text or "").split()])
                    if values.size == 0 or values.size % 3:
                        raise ValueError("Invalid XYZ coordinate grouping")
                    xyz = values.reshape(-1, 3)
                    if not np.isfinite(xyz).all():
                        raise ValueError("Non-finite coordinates")
                    if len(xyz) < 4:
                        raise ValueError("Ring needs at least four positions including closure")
                    if not np.allclose(xyz[0], xyz[-1], atol=1e-7, rtol=0):
                        raise ValueError("Unclosed ring")
                    if np.unique(xyz[:-1], axis=0).shape[0] < 3:
                        raise ValueError("Ring needs at least three distinct vertices")
                    count = pos.get("count")
                    if count is not None and int(count) != len(xyz):
                        raise ValueError("posList count does not match vertex count")
                    arrays.append(xyz)
                    crs_values.append(crs)
                if len(set(crs_values)) != 1:
                    raise ValueError("Mixed CRS declarations within polygon")
                surface.polygons.append(Polygon(polygon.get(GML_ID), arrays[0], arrays[1:], crs_values[0], 3))
            except ValueError as exc:
                building.issues.append(InspectionIssue(polygon_context, f"Excluded polygon: {exc}"))
    # Report polygon geometry outside a recognized semantic surface as unsupported.
    owned_surfaces = {n for n in nodes if n.tag in {_tag('bldg', s) for s in SURFACES}}
    for node in nodes:
        if node.tag != _tag("gml", "Polygon"):
            continue
        ancestor = parents.get(node)
        while ancestor is not None and ancestor is not element and ancestor not in owned_surfaces:
            ancestor = parents.get(ancestor)
        if ancestor not in owned_surfaces:
            building.issues.append(InspectionIssue(node.get(GML_ID) or "/".join(owner_path),
                                                   "Polygon outside supported semantic surface; not extracted"))
    return building


def iter_buildings(path: str | Path, limit: int | None = None) -> Iterator[Building]:
    """Yield top-level buildings, with nested parts, from a CityGML 2.0 file.

    ``limit`` counts top-level buildings, not parts. None reads the whole file;
    zero returns no records. XML errors abort with ValueError. Unsupported or
    invalid geometry is recorded on its owning building/part without repair.
    Memory holds one XML member plus whichever returned records the caller keeps.
    Close the generator when stopping early (e.g. with contextlib.closing).
    """
    if limit is not None and (isinstance(limit, bool) or not isinstance(limit, int) or limit < 0):
        raise ValueError("limit must be a nonnegative integer or None")
    if limit == 0:
        return
    envelope = {}
    root = None
    yielded = 0
    try:
        with Path(path).open("rb") as source:
            for event, element in ET.iterparse(source, events=("start", "end")):
                if event == "start":
                    if root is None:
                        root = element
                        if root.tag != _tag("core", "CityModel"):
                            raise ValueError("Expected a CityGML 2.0 CityModel root")
                    continue
                if element.tag == _tag("gml", "Envelope") and element in list(root.iterfind("gml:boundedBy/gml:Envelope", NS)):
                    envelope = dict(element.attrib)
                if element.tag != _tag("core", "cityObjectMember"):
                    continue
                parents = {c: p for p in element.iter() for c in p}
                def inherited(node, key):
                    while node is not None:
                        if key in node.attrib:
                            return node.get(key)
                        node = parents.get(node)
                    return root.get(key) or envelope.get(key)
                records = [_parse_building(child, parents, inherited) for child in element
                           if child.tag == _tag("bldg", "Building")]
                root.remove(element)
                element.clear()
                # Drop XML references before yielding independent NumPy records.
                parents.clear()
                for record in records:
                    yield record
                    yielded += 1
                    if limit is not None and yielded >= limit:
                        return
    except ET.ParseError as exc:
        raise ValueError(f"Malformed CityGML XML in {path}: {exc}") from exc
