"""Shadow scene preparation for the study area; geometry and solar calculations stay in Python."""
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
import json
import gzip
import base64
import math

import geopandas as gpd
import numpy as np
import pandas as pd
import pyarrow.dataset as ds
import pydeck as pdk
from pvlib.solarposition import get_solarposition
from pyproj import Transformer
from shapely import make_valid, transform
from shapely.geometry import MultiPolygon, Polygon, box
from shapely.geometry.polygon import orient

STUDY_BOUNDS = (-74.001, 40.685, -73.974, 40.702)  # Building shadows: Downtown Brooklyn and Brooklyn Heights.
STUDY_AREA_NAME = 'Brooklyn'
IMPACT_BOUNDS = STUDY_BOUNDS  # Height impact: tall construction is plausible here; 57 permit sites.
IMPACT_AREA_NAME = 'Downtown Brooklyn'
BUFFER_M = 1000
MAX_BUILDINGS = 20_000
NYC_BOUNDS = (-74.26, 40.49, -73.69, 40.92)
TIMEZONE = 'America/New_York'
METRIC_CRS = 'EPSG:32618'
FEET_TO_METERS = 0.3048
ROOF_COLOR = [160, 160, 160]  # No measured exposure.
EXPOSURE_COLORS = [[255, 255, 0], [255, 128, 0], [255, 0, 0]]
WALL_COLOR = [113, 143, 165]
PERMIT_COLOR = [20, 90, 160]  # Roof outline for approved DOB solar permits.
CAMERAS = {
    'Overview': {'longitude': -73.9875, 'latitude': 40.6935, 'zoom': 14.3, 'pitch': 55, 'bearing': -20},
    'Brooklyn Tower': {'longitude': -73.982274, 'latitude': 40.690581, 'zoom': 15, 'pitch': 55, 'bearing': -25},
    'Brooklyn Heights': {'longitude': -73.994480, 'latitude': 40.695988, 'zoom': 16, 'pitch': 55, 'bearing': -20},
}


@dataclass
class ShadowScene:
    spec: dict
    payload: str
    buildings: int
    excluded: int
    repaired: int
    load_bounds: tuple[float, float, float, float]


def buffered_bounds(bounds: tuple[float, float, float, float], buffer_m: float = BUFFER_M):
    west, south, east, north = bounds
    if not all(math.isfinite(v) for v in bounds) or not west < east or not south < north:
        raise ValueError('Enter valid west/east and south/north bounds.')
    if not (NYC_BOUNDS[0] <= west < east <= NYC_BOUNDS[2] and NYC_BOUNDS[1] <= south < north <= NYC_BOUNDS[3]):
        raise ValueError('Choose an area within NYC (longitude −74.26 to −73.69, latitude 40.49 to 40.92).')
    area = gpd.GeoSeries([box(*bounds)], crs='OGC:CRS84').to_crs(METRIC_CRS)
    return tuple(float(v) for v in area.buffer(buffer_m).to_crs('OGC:CRS84').total_bounds)


def daylight_steps(day: date, latitude: float, longitude: float) -> list[dict]:
    """UTC-spaced slots preserve both occurrences of a repeated DST hour."""
    start = pd.Timestamp(day).tz_localize(TIMEZONE)
    end = pd.Timestamp(day + timedelta(days=1)).tz_localize(TIMEZONE)
    times = pd.date_range(start, end, freq='15min', inclusive='left')
    solar = get_solarposition(times, latitude, longitude)
    result = []
    for timestamp, elevation, azimuth in zip(times, solar.elevation, solar.azimuth):
        altitude, bearing = np.radians([elevation, azimuth])
        result.append({
            'timestamp': int(timestamp.timestamp() * 1000),
            'label': timestamp.strftime('%b %d, %Y · %I:%M %p %Z (UTC%z)'),
            'elevation': round(float(elevation), 2),
            'direction': [-float(np.sin(bearing) * np.cos(altitude)),
                          -float(np.cos(bearing) * np.cos(altitude)), -float(np.sin(altitude))],
            'noon': timestamp.hour == 12 and timestamp.minute == 0,
        })
    return result


def _polygons(geometry):
    if isinstance(geometry, Polygon):
        yield geometry
    elif isinstance(geometry, MultiPolygon) or geometry.geom_type == 'GeometryCollection':
        for part in geometry.geoms:
            yield from _polygons(part)


def exposure_color(value: float | None, exposure_range: tuple[float, float] | None) -> list[int]:
    if value is None or not math.isfinite(value) or exposure_range is None:
        return list(ROOF_COLOR)
    low, high = exposure_range
    fraction = float(np.clip((value - low) / (high - low), 0, 1)) if high > low else 0.5
    segment = min(int(fraction * 2), 1)
    weight = fraction * 2 - segment
    return [round(a + (b - a) * weight) for a, b in zip(EXPOSURE_COLORS[segment], EXPOSURE_COLORS[segment + 1])]


def prepare_scene(frame: gpd.GeoDataFrame, bounds=STUDY_BOUNDS, load_bounds=None,
                  exposure_range: tuple[float, float] | None = None,
                  permit_bins: frozenset[str] = frozenset()) -> ShadowScene:
    """Separate roofs and wall quads, with no duplicate extrusion caps.

    Roofs whose BIN is in `permit_bins` get an outline layer; building records are unchanged.
    """
    # shortcut: flat roofs and level ground; use detailed meshes for engineering analysis.
    frame = frame.to_crs('OGC:CRS84')
    if 'roof_exposure' not in frame:
        frame['roof_exposure'] = np.nan
    project = Transformer.from_crs('OGC:CRS84', METRIC_CRS, always_xy=True).transform
    roofs, walls, permit_outlines = [], [], []
    building_info = {}
    excluded = repaired = buildings = 0
    columns = ['height_roo', 'geometry', 'feature_co', 'doitt_id', 'bin', 'base_bbl', 'roof_exposure']
    for source_height, geometry, feature_code, building_id, bin_value, bbl, exposure in frame[columns].itertuples(index=False, name=None):
        height = float(source_height) * FEET_TO_METERS if pd.notna(source_height) else float('nan')
        if not math.isfinite(height) or height <= 0 or geometry is None or geometry.is_empty or feature_code == 1003:
            excluded += 1
            continue
        if not geometry.is_valid:
            geometry = make_valid(geometry)
            repaired += 1
        polygons = list(_polygons(geometry))
        if not polygons:
            excluded += 1
            continue
        exposure = float(exposure) if pd.notna(exposure) and math.isfinite(exposure) else None
        properties = {'building_id': str(int(building_id)), 'bin': str(int(bin_value)) if pd.notna(bin_value) else '',
                      'bbl': str(bbl), 'height_m': round(height, 2),
                      'roof_area_m2': round(sum(transform(p, project, interleaved=False).area for p in polygons), 2),
                      'roof_exposure': exposure}
        buildings += 1
        building_info[properties['building_id']] = properties
        identity = {'building_id': properties['building_id']}
        for polygon in polygons:
            # Normalize ring winding so courtyard walls face the courtyard.
            polygon = orient(polygon, sign=1.0)
            rings = [polygon.exterior, *polygon.interiors]
            roofs.append({**identity, 'color': exposure_color(exposure, exposure_range), 'polygon': [
                [[round(float(x), 7), round(float(y), 7), round(height, 3)] for x, y, *_ in ring.coords] for ring in rings]})
            if properties['bin'] in permit_bins:
                # Slightly above the roof so the outline is not hidden by the roof surface.
                permit_outlines.append({'path': [[x, y, round(height + 0.2, 3)] for x, y, _ in roofs[-1]['polygon'][0]]})
            for ring in rings:
                coords = [(round(c[0], 7), round(c[1], 7)) for c in ring.coords]
                for a, b in zip(coords, coords[1:]):
                    if a[:2] == b[:2]:
                        continue
                    walls.append({**identity, 'polygon': [
                        [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], height],
                        [a[0], a[1], height], [a[0], a[1], 0]]})
    if not roofs:
        raise ValueError('No buildings with usable geometry and positive heights were found in this area.')
    extent = load_bounds or buffered_bounds(bounds)
    west, south, east, north = extent
    material = {'ambient': 0.4, 'diffuse': 0.8, 'shininess': 0, 'specularColor': [0, 0, 0]}
    common = dict(extruded=False, stroked=False, pickable=True, shadow_enabled=True, material=material)
    ground = pdk.Layer('SolidPolygonLayer', id='ground', data=[{'polygon': [
        [west, south, -0.05], [east, south, -0.05], [east, north, -0.05], [west, north, -0.05]]}],
        get_polygon='polygon', get_fill_color=[215, 220, 216], pickable=False, material=material, shadow_enabled=True)
    wall_layer = pdk.Layer('SolidPolygonLayer', id='walls', data=walls, get_polygon='polygon',
                           get_fill_color=WALL_COLOR, _full3d=True, **common)
    roof_layer = pdk.Layer('SolidPolygonLayer', id='roofs', data=roofs, get_polygon='polygon',
                           get_fill_color='color', **common)
    boundary = pdk.Layer('PathLayer', id='study-boundary', data=[{'path': list(box(*bounds).exterior.coords)}],
                         get_path='path', get_color=[42, 112, 110], get_width=2, width_units='"pixels"', shadow_enabled=False)
    # pydeck sends bare strings as accessor expressions; quote literals such as units.
    permits = pdk.Layer('PathLayer', id='permit-roofs', data=permit_outlines, get_path='path', get_color=PERMIT_COLOR,
                        get_width=2, width_units='"pixels"', pickable=False, shadow_enabled=False)
    camera = dict(CAMERAS['Overview'])
    camera.update(longitude=(bounds[0] + bounds[2]) / 2, latitude=(bounds[1] + bounds[3]) / 2)
    if tuple(bounds) != STUDY_BOUNDS:
        span = max(bounds[2] - bounds[0], (bounds[3] - bounds[1]) / math.cos(math.radians(camera['latitude'])))
        camera['zoom'] = float(np.clip(math.log2(360 / span) - 1.5, 10, 18))
    deck = pdk.Deck(layers=[ground, wall_layer, roof_layer, permits, boundary], map_provider=None, map_style=None,
                    initial_view_state=pdk.ViewState(**camera))
    spec = json.loads(deck.to_json())
    spec['buildingInfo'] = building_info
    spec['roofExposure'] = {'range': exposure_range,
                            'measured': sum(info['roof_exposure'] is not None for info in building_info.values())}
    spec['permitRoofs'] = sum(info['bin'] in permit_bins for info in building_info.values())
    payload = base64.b64encode(gzip.compress(json.dumps(spec, separators=(',', ':')).encode(), compresslevel=3)).decode()
    return ShadowScene(spec, payload, buildings, excluded, repaired, extent)


def load_scene(path: str | Path, bounds=STUDY_BOUNDS, buffer_m=BUFFER_M, max_buildings=MAX_BUILDINGS,
               radiation_path: str | Path | None = None, permit_path: str | Path | None = None) -> ShadowScene:
    extent = buffered_bounds(bounds, buffer_m)
    west, south, east, north = extent
    dataset = ds.dataset(str(path), format='parquet')
    geo = json.loads(dataset.schema.metadata[b'geo'])
    covering = geo['columns'][geo['primary_column']]['covering']['bbox']
    bbox = lambda name: ds.field(tuple(covering[name]))
    intersects = (bbox('xmin') <= east) & (bbox('xmax') >= west) & (bbox('ymin') <= north) & (bbox('ymax') >= south)
    count = dataset.count_rows(filter=intersects)
    if count > max_buildings:
        raise ValueError(f'This area plus its buffer contains {count:,} buildings; the limit is {max_buildings:,}. Choose a smaller area.')
    columns = ['geometry', 'height_roo', 'doitt_id', 'bin', 'base_bbl', 'feature_co', 'ground_ele']
    frame = gpd.read_parquet(path, columns=columns, bbox=extent)
    exposure_range = None
    if radiation_path is not None and Path(radiation_path).exists():
        radiation = pd.read_parquet(radiation_path, columns=['doitt_id', 'MEAN_1'])
        radiation = radiation.rename(columns={'MEAN_1': 'roof_exposure'})
        radiation['roof_exposure'] = radiation.roof_exposure.where(np.isfinite(radiation.roof_exposure))
        values = radiation.roof_exposure.dropna()
        if not values.empty:
            exposure_range = (float(values.min()), float(values.max()))
        frame = frame.merge(radiation, on='doitt_id', how='left', validate='many_to_one')
    permit_bins: frozenset[str] = frozenset()
    if permit_path is not None and Path(permit_path).exists():
        bins = pd.read_parquet(permit_path, columns=['Bin']).Bin.dropna()
        permit_bins = frozenset(bins.astype('int64').astype(str))
    return prepare_scene(frame, bounds, extent, exposure_range, permit_bins)
