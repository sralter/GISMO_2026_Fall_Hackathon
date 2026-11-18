"""Raise one building and estimate the change in nearby roofs' clear-sky solar output and bill savings.

Shading uses the skyline engine in roof_solar.py on the citywide footprints (dataset 09): target roofs
are sampled every 10 m, skylines every 5° are traced against footprint columns within 1 km, and hourly
Ineichen clear-sky direct and isotropic diffuse light are integrated over a year. A skyline is the
highest obstacle in each direction, so the raised building is traced on its own at its new height and
combined with today's skyline by maximum; raising a building can only lower a neighbour's sunlight.

Energy and dollars follow conversion.ipynb:
    kWh/yr  = roof m² × usable fraction × annual kWh/m² × panel efficiency × performance ratio
    use     = roof sqft × floors × kWh/sqft/yr
    $/yr    = min(solar, use) × retail rate + excess solar × export credit
Dataset 09 has no floor count or land use, so floors = roof height / 10 ft and use intensity is one
assumed value for every building.
"""
from dataclasses import dataclass
from pathlib import Path
import math

import geopandas as gpd
import numpy as np
import pandas as pd
import shapely
from shapely.affinity import translate
from shapely.geometry import Polygon, box

from .roof_solar import HorizonIndex, SolarConfig, annual_times, clean_buildings, evaluate, sample_roof, solar_weather
from .shadows import FEET_TO_METERS, IMPACT_BOUNDS, METRIC_CRS, _polygons, buffered_bounds

DATA_DIR = Path(__file__).resolve().parents[2] / 'data' / 'buildings'
FOOTPRINTS_PATH = DATA_DIR / '09_NYC_Building_Footprints.parquet'
PERMITS_PATH = DATA_DIR / '26_dob_solar_approved_permits_11142026.parquet'
FLOOR_HEIGHT_FT = 10  # Typical NYC storey, used to estimate floors from roof height.
SQFT_TO_M2 = 0.092903
# Shadow zone: lower sun carries little energy and casts very long shadows. Sprint 2 extends it to 5°.
MIN_ELEVATION_DEG = 10.0
SKY_RING_RISE_MULTIPLE = 2.0  # Roofs this many building heights away can lose diffuse sky light.
BAND_M = 5.0  # Roof height bands for the shadow zone.
MAX_REACH_M = 1000.0
SITE_RADIUS_M = 300.0  # A raised building must be this close to the chosen permit site.
# Same year and caster buffer as Building shadows; 10 m roof sampling (not 5 m) keeps scenarios fast for the
# demo, about 2.3x faster with total $ lost within 0.4%. Sun position at the impact area's center.
CONFIG = SolarConfig(bounds=IMPACT_BOUNDS, spacing_m=10.)


@dataclass(frozen=True)
class Assumptions:
    """Defaults from conversion.ipynb; none of these values cite a source."""
    panel_efficiency: float = 0.20
    performance_ratio: float = 0.80
    usable_roof_fraction: float = 0.3
    rate_usd_per_kwh: float = 0.28  # Approx. Con Edison blended rate.
    export_credit_usd_per_kwh: float = 0.10
    building_kwh_per_sqft: float = 12.0  # conversion.ipynb default intensity; no land use in dataset 09.


def load_footprints(path: str | Path, bounds=IMPACT_BOUNDS) -> gpd.GeoDataFrame:
    """Usable footprints around the impact area in metres (EPSG:32618), indexed by DOITT id.

    The read extends past the impact area by the site radius, the maximum shadow reach and the
    caster buffer, so every roof a raised building can shade has all of its own casters.
    """
    extent = buffered_bounds(bounds, SITE_RADIUS_M + MAX_REACH_M + CONFIG.caster_buffer_m)
    columns = ['doitt_id', 'bin', 'height_roo', 'ground_ele', 'feature_co', 'geometry']
    frame = clean_buildings(gpd.read_parquet(path, columns=columns, bbox=extent))
    frame = frame[frame.status == 'ok'].copy()
    frame['building_id'] = frame.doitt_id.astype(str)
    frame['bin'] = frame['bin'].astype('Int64').astype(str).replace('<NA>', '')
    frame['height_ft'] = frame.height_roo
    frame['height_m'] = frame.height_ft * FEET_TO_METERS
    frame['roof_sqft'] = frame.roof_area_m2 / SQFT_TO_M2
    frame['floors'] = (frame.height_ft / FLOOR_HEIGHT_FT).round().clip(lower=1)
    study = gpd.GeoSeries([box(*bounds)], crs='OGC:CRS84').to_crs(METRIC_CRS).iloc[0]
    frame['in_study_area'] = frame.intersects(study)
    columns = ['building_id', 'bin', 'height_ft', 'height_m', 'ground_ele', 'roof_z', 'roof_area_m2',
               'roof_sqft', 'floors', 'in_study_area', 'geometry']
    return frame[columns].set_index('building_id', drop=False).rename_axis(None)


def load_permit_sites(path: str | Path, frame: gpd.GeoDataFrame) -> pd.DataFrame:
    """Footprints with approved DOB solar permits, matched by BIN and indexed by DOITT id.

    BIN, not location: permit points sit on the street frontage, usually outside the footprint.
    """
    permits = pd.read_parquet(path, columns=['Bin', 'House No', 'Street Name', 'Borough', 'Permit Status',
                                             'Estimated Job Costs', 'Latitude', 'Longitude'])
    permits = permits[permits.Bin.notna()]
    permits['bin'] = permits.Bin.astype('int64').astype(str)
    street = (permits['House No'].fillna('') + ' ' + permits['Street Name'].fillna('').str.title()).str.strip()
    permits['address'] = street + ', ' + permits.Borough.fillna('').str.title()
    grouped = permits.groupby('bin').agg(
        address=('address', 'first'), permits=('bin', 'size'), status=('Permit Status', 'last'),
        job_cost_usd=('Estimated Job Costs', 'sum'), latitude=('Latitude', 'first'), longitude=('Longitude', 'first'))
    ids = pd.DataFrame({'building_id': frame.building_id.to_numpy(), 'bin': frame['bin'].to_numpy(),
                        'in_study_area': frame.in_study_area.to_numpy()})
    return ids.merge(grouped, left_on='bin', right_index=True).set_index('building_id').rename_axis(None)


def annual_weather(config: SolarConfig = CONFIG) -> pd.DataFrame:
    """Hourly clear-sky sun for the model year, identical to the Building shadows annual run."""
    return solar_weather(annual_times(config.year), config.bounds)


def _shadow_parts(footprint, relative_height_m: float, azimuth_deg: float, elevation_deg: float) -> list:
    """Pieces whose union is a prism's shadow on a plane `relative_height_m` below its roof.

    Courtyards are treated as solid, which slightly overstates shade inside them.
    """
    length = relative_height_m / math.tan(math.radians(elevation_deg))
    dx = -length * math.sin(math.radians(azimuth_deg))
    dy = -length * math.cos(math.radians(azimuth_deg))
    parts = []
    for polygon in _polygons(footprint):
        solid = Polygon(polygon.exterior)
        xy = np.asarray(solid.exterior.coords)[:, :2]
        a, b, offset = xy[:-1], xy[1:], np.array([dx, dy])
        parts += [solid, translate(solid, dx, dy), *shapely.polygons(np.stack([a, b, b + offset, a + offset, a], axis=1))]
    return parts


def shadow_polygon(footprint, relative_height_m: float, azimuth_deg: float, elevation_deg: float):
    """Ground shadow of one prism, for the map preview only; energy uses the skyline engine."""
    if relative_height_m <= 0 or elevation_deg <= 0:
        return None
    return shapely.union_all(_shadow_parts(footprint, relative_height_m, azimuth_deg, elevation_deg))


def solar_economics(roof_sqft, floors, annual_kwh_m2, assumptions: Assumptions = Assumptions()) -> pd.DataFrame:
    """conversion.ipynb: generation, building use, and the bill savings split into offset and export."""
    a = assumptions
    panel_m2 = np.asarray(roof_sqft, float) * SQFT_TO_M2 * a.usable_roof_fraction
    kwh = panel_m2 * np.asarray(annual_kwh_m2, float) * a.panel_efficiency * a.performance_ratio
    use = np.asarray(roof_sqft, float) * np.asarray(floors, float) * a.building_kwh_per_sqft
    offset = np.minimum(kwh, use)
    exported = kwh - offset
    return pd.DataFrame({'capacity_kw': panel_m2 * a.panel_efficiency,  # STC: 1 kW/m² of sunlight.
                         'kwh_per_year': kwh, 'building_kwh_per_year': use, 'kwh_offset': offset,
                         'kwh_exported': exported,
                         'usd_per_year': offset * a.rate_usd_per_kwh + exported * a.export_credit_usd_per_kwh})


def _longest_shadows(weather: pd.DataFrame) -> pd.DataFrame:
    """Lowest sun at or above MIN_ELEVATION_DEG per half degree of azimuth; shorter shadows lie inside these."""
    sun = weather.loc[weather.elevation >= MIN_ELEVATION_DEG, ['azimuth', 'elevation']]
    return sun.loc[sun.groupby((sun.azimuth * 2).round()).elevation.idxmin()]


def impact_zone(frame: gpd.GeoDataFrame, raised_id: str, added_m: float, weather: pd.DataFrame) -> pd.Series:
    """Distance (m) to every building the raised building can shade, nearest first.

    A building is in the zone if a shadow with the sun at or above MIN_ELEVATION_DEG reaches it, or if it lies
    within SKY_RING_RISE_MULTIPLE times the new height, where it loses diffuse sky light. Roofs are grouped
    in BAND_M height bands, each tested against the shadows cast onto its lowest height, so downhill roofs get
    longer shadows without stretching the zone for every roof. Limited to MAX_REACH_M.
    """
    footprint = frame.geometry[raised_id]
    top = frame.roof_z[raised_id] + added_m
    distance = frame.distance(footprint).drop(raised_id)
    others = frame.loc[distance.index[distance <= MAX_REACH_M]]
    ring = footprint.buffer(SKY_RING_RISE_MULTIPLE * (frame.height_m[raised_id] + added_m))
    sun = _longest_shadows(weather)
    inside = []
    for floor, band in others.groupby(np.floor(others.roof_z / BAND_M) * BAND_M):
        shadows = [shadow_polygon(footprint, top - floor, az, el) for az, el in sun.itertuples(index=False)]
        zone = shapely.union_all([ring, *(s for s in shadows if s is not None)])
        inside += band.index[band.intersects(zone)].tolist()
    return distance[inside].sort_values()


def _annual_kwh_m2(horizon, owners, weights, count, weather) -> np.ndarray:
    irradiance, _ = evaluate(horizon, owners, weights, count, weather)
    return irradiance.sum(axis=0, dtype=np.float64) / 1000  # Hourly steps: W·h → kWh.


def roof_kwh_m2(frame: gpd.GeoDataFrame, raised_id: str, added_ft: float, target_ids,
                weather: pd.DataFrame, config: SolarConfig = CONFIG) -> pd.DataFrame:
    """Annual clear-sky kWh/m² on each target roof: unobstructed, today, and after the raise."""
    columns = ['unobstructed_kwh_m2', 'annual_kwh_m2_before', 'annual_kwh_m2_after']
    targets = frame.loc[list(target_ids)]
    if targets.empty:
        return pd.DataFrame(columns=columns, dtype=float)
    raised = frame.loc[[raised_id]].copy()
    raised['roof_z'] += added_ft * FEET_TO_METERS
    west, south, east, north = pd.concat([targets.geometry, raised.geometry]).total_bounds
    buffer = config.caster_buffer_m
    casters = frame.cx[west - buffer:east + buffer, south - buffer:north + buffer]
    today = HorizonIndex(casters)
    raised_only = HorizonIndex(raised, bottom=today.bottom)
    points, weights, owners = [], [], []
    for owner, row in enumerate(targets.itertuples()):
        xy, areas = sample_roof(row.geometry, config.spacing_m)
        points.append(np.column_stack([xy, np.full(len(xy), row.roof_z + .02)]))
        weights.append(areas)
        owners.append(np.full(len(xy), owner, dtype=np.int64))
    points, weights, owners = np.concatenate(points), np.concatenate(weights), np.concatenate(owners)
    before = today.horizons(points, config.azimuth_step_deg)
    after = np.maximum(before, raised_only.horizons(points, config.azimuth_step_deg))
    count = len(targets)
    values = [_annual_kwh_m2(horizon, owners, weights, count, weather)
              for horizon in (np.zeros_like(before), before, after)]
    return pd.DataFrame(dict(zip(columns, values)), index=targets.index)


def shade_scenario(frame: gpd.GeoDataFrame, raised_id: str, added_ft: float, weather: pd.DataFrame,
                   permit_ids=()) -> tuple[pd.DataFrame, pd.Series]:
    """Per-roof annual sunlight before and after raising one building, for every roof in its impact zone."""
    if raised_id not in frame.index:
        raise ValueError(f'Unknown building {raised_id}')
    if not 0 <= added_ft <= 2000:
        raise ValueError('Added height must be between 0 and 2,000 ft')
    zone = impact_zone(frame, raised_id, added_ft * FEET_TO_METERS, weather)
    # Only roofs below the new top can be shaded; a taller roof sees the building below its horizon.
    distance = zone[frame.roof_z[zone.index] < frame.roof_z[raised_id] + added_ft * FEET_TO_METERS]
    rows = frame.loc[distance.index, ['building_id', 'bin', 'height_ft', 'roof_sqft', 'floors']].copy()
    rows['is_permit'] = rows.index.isin(list(permit_ids))
    rows['distance_m'] = distance.round(1)
    rows = rows.join(roof_kwh_m2(frame, raised_id, added_ft, distance.index, weather))
    for label in ['before', 'after']:
        rows[f'sun_lost_{label}'] = 1 - np.divide(
            rows[f'annual_kwh_m2_{label}'], rows.unobstructed_kwh_m2,
            out=np.ones(len(rows)), where=rows.unobstructed_kwh_m2.to_numpy() > 0)
    return rows.reset_index(drop=True), zone


def price_scenario(shading: pd.DataFrame, assumptions: Assumptions = Assumptions()) -> pd.DataFrame:
    """Adds system size, kWh and bill savings before and after to a `shade_scenario` table."""
    rows = shading.copy()
    for label in ['before', 'after']:
        economics = solar_economics(rows.roof_sqft, rows.floors, rows[f'annual_kwh_m2_{label}'], assumptions)
        rows['capacity_kw'] = economics.capacity_kw.to_numpy()
        for column in ['kwh_per_year', 'usd_per_year']:
            rows[f'{column}_{label}'] = economics[column].to_numpy()
    rows['delta_kwh_per_year'] = rows.kwh_per_year_after - rows.kwh_per_year_before
    rows['delta_usd_per_year'] = rows.usd_per_year_after - rows.usd_per_year_before
    return rows


def simulate_height_increase(frame: gpd.GeoDataFrame, raised_id: str, added_ft: float, weather: pd.DataFrame,
                             assumptions: Assumptions = Assumptions(), permit_ids=()) -> pd.DataFrame:
    """Before/after solar and bill savings on the roofs one raised building can shade."""
    shading, _ = shade_scenario(frame, raised_id, added_ft, weather, permit_ids)
    return price_scenario(shading, assumptions)
