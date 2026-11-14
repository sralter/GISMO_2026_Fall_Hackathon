"""Raise one building and estimate the change in neighbours' rooftop solar output and bill savings.

Shading: each footprint is a flat-roofed prism. For clear-sky sun positions on the 21st of every
month, the share of a target roof inside neighbours' shadows removes that share of direct (beam)
sunlight. Diffuse light is not reduced (no sky-view model).

Energy and dollars follow conversion.ipynb:
    kWh/yr  = roof m² × usable fraction × irradiance × panel efficiency × performance ratio
    use     = roof sqft × floors × kWh/sqft/yr for the land use
    $/yr    = min(solar, use) × retail rate + excess solar × export credit
"""
from dataclasses import dataclass
from pathlib import Path
import math

import geopandas as gpd
import numpy as np
import pandas as pd
import pyarrow.parquet as pq
import shapely
from pvlib.location import Location
from shapely.affinity import translate
from shapely.geometry import Polygon

from .shadows import FEET_TO_METERS, METRIC_CRS, TIMEZONE, _polygons

DATA_DIR = Path(__file__).resolve().parents[2] / 'data' / 'buildings'
FOOTPRINTS_PATH = DATA_DIR / '18_NYC_Solar_Candidates_With_Radiation.parquet'
PERMITS_PATH = DATA_DIR / '26_dob_solar_approved_permits_11142026.parquet'
FLOOR_HEIGHT_FT = 10  # Typical NYC storey; used only when the measured roof height is missing.
SQFT_TO_M2 = 0.092903
MIN_ELEVATION_DEG = 5.0  # Lower sun carries little beam energy and casts unbounded shadows.
MAX_REACH_M = 1000.0
NYC_LON_LAT = (-73.95, 40.70)
KWH_PER_SQFT_BY_LANDUSE = {'05': 16.0, '06': 12.0}  # Commercial & office; industrial (conversion.ipynb).
DEFAULT_KWH_PER_SQFT = 12.0


@dataclass(frozen=True)
class Assumptions:
    """Defaults from conversion.ipynb."""
    nyc_irradiance_kwh_m2_yr: float = 1400.0  # Typical NYC rooftop insolation.
    max_irradiance_kwh_m2_yr: float = 1600.0
    panel_efficiency: float = 0.20
    performance_ratio: float = 0.80
    usable_roof_fraction: float = 0.3
    rate_usd_per_kwh: float = 0.28  # Approx. Con Edison blended rate.
    export_credit_usd_per_kwh: float = 0.10


def building_heights_ft(frame: pd.DataFrame) -> pd.Series:
    """Measured roof height (height_roo), else an estimate from the floor count."""
    height = frame['height_roo'].where(frame['height_roo'] > 0)
    if 'NumFloors' in frame:
        height = height.fillna(frame['NumFloors'].where(frame['NumFloors'] > 0) * FLOOR_HEIGHT_FT)
    return height


def load_footprints(path: str | Path) -> gpd.GeoDataFrame:
    """Footprints in metres (EPSG:32618), indexed by DOITT id, with heights and economics inputs."""
    wanted = ['geometry', 'doitt_id', 'bin', 'height_roo', 'NumFloors', 'LandUse', 'RoofArea_sqft', 'MEAN_1', 'feature_co']
    names = set(pq.read_schema(path).names)
    frame = gpd.read_parquet(path, columns=[c for c in wanted if c in names])
    frame['height_ft'] = building_heights_ft(frame)
    keep = (frame.height_ft > 0) & frame.geometry.notna() & ~frame.geometry.is_empty & frame.doitt_id.notna()
    if 'feature_co' in frame:
        keep &= frame.feature_co != 1003
    frame = frame[keep].to_crs(METRIC_CRS)
    invalid = ~frame.geometry.is_valid
    frame.loc[invalid, 'geometry'] = shapely.make_valid(frame.geometry[invalid].values)
    frame['building_id'] = frame.doitt_id.astype('int64').astype(str)
    frame['bin'] = frame['bin'].astype('Int64').astype(str).replace('<NA>', '') if 'bin' in frame else ''
    frame['height_m'] = frame.height_ft * FEET_TO_METERS
    roof = frame['RoofArea_sqft'] if 'RoofArea_sqft' in frame else pd.Series(np.nan, index=frame.index)
    frame['roof_sqft'] = roof.fillna(frame.geometry.area / SQFT_TO_M2)
    floors = frame['NumFloors'] if 'NumFloors' in frame else pd.Series(np.nan, index=frame.index)
    frame['floors'] = floors.where(floors > 0).fillna((frame.height_ft / FLOOR_HEIGHT_FT).round().clip(lower=1))
    frame['land_use'] = frame['LandUse'].fillna('').astype(str) if 'LandUse' in frame else ''
    radiation = frame['MEAN_1'] if 'MEAN_1' in frame else pd.Series(np.nan, index=frame.index)
    frame['radiation'] = radiation.where(np.isfinite(radiation) & (radiation > 0))
    columns = ['building_id', 'bin', 'height_ft', 'height_m', 'roof_sqft', 'floors', 'land_use', 'radiation', 'geometry']
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
    ids = pd.DataFrame({'building_id': frame.building_id.to_numpy(), 'bin': frame['bin'].to_numpy()})
    return ids.merge(grouped, left_on='bin', right_index=True).set_index('building_id').rename_axis(None)


def sun_samples(year: int = 2026, lon_lat: tuple[float, float] = NYC_LON_LAT) -> pd.DataFrame:
    """Hourly clear-sky sun on the 21st of each month; `weight` is the hours each sample stands for."""
    days = [pd.Timestamp(year, month, 21) for month in range(1, 13)]
    times = pd.DatetimeIndex(np.concatenate([
        pd.date_range(day, periods=24, freq='1h', tz=TIMEZONE) + pd.Timedelta('30min') for day in days]))
    location = Location(lon_lat[1], lon_lat[0], TIMEZONE)
    position = location.get_solarposition(times)
    sky = location.get_clearsky(times, model='simplified_solis', solar_position=position)
    elevation = position.apparent_elevation.to_numpy()
    frame = pd.DataFrame({
        'elevation': elevation, 'azimuth': position.azimuth.to_numpy(), 'ghi': sky.ghi.to_numpy(),
        'beam_horizontal': (sky.dni.to_numpy() * np.sin(np.radians(elevation))).clip(min=0),
        'weight': np.repeat([day.days_in_month for day in days], 24).astype(float)})
    return frame[frame.elevation > 0].reset_index(drop=True)


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
    if relative_height_m <= 0 or elevation_deg <= 0:
        return None
    return shapely.union_all(_shadow_parts(footprint, relative_height_m, azimuth_deg, elevation_deg))


def _shaded_fraction(target, parts: list) -> float:
    if not parts:
        return 0.0
    intersecting = np.asarray(parts, dtype=object)
    intersecting = intersecting[shapely.intersects(intersecting, target)]
    return shapely.union_all(intersecting).intersection(target).area / target.area if len(intersecting) else 0.0


def shading_losses(frame: gpd.GeoDataFrame, target_id: str, scenarios: list[pd.Series],
                   samples: pd.DataFrame) -> list[float]:
    """Annual share of clear-sky sunlight lost on a target roof, for each set of building heights."""
    target = frame.geometry[target_id]
    shapely.prepare(target)
    distance = frame.distance(target).drop(target_id)
    total = float((samples.ghi * samples.weight).sum())
    lit = samples[samples.elevation >= MIN_ELEVATION_DEG]
    # Keep only buildings taller than the target that could reach it at the lowest sun considered.
    candidates = []
    for heights in scenarios:
        relative = heights.drop(target_id) - heights[target_id]
        keep = (relative > 0) & (distance <= relative / math.tan(math.radians(MIN_ELEVATION_DEG)))
        candidates.append((relative[keep], distance[keep]))
    lost = [0.0] * len(scenarios)
    for elevation, azimuth, beam, weight in lit[['elevation', 'azimuth', 'beam_horizontal', 'weight']].itertuples(index=False):
        reach = 1 / math.tan(math.radians(elevation))
        cache: dict[tuple[str, float], list] = {}
        for i, (relative, near) in enumerate(candidates):
            casters = relative[near <= relative * reach]
            parts = []
            for caster_id, height in casters.items():
                key = (caster_id, height)
                if key not in cache:
                    cache[key] = _shadow_parts(frame.geometry[caster_id], height, azimuth, elevation)
                parts += cache[key]
            lost[i] += beam * weight * _shaded_fraction(target, parts)
    return [value / total if total else 0.0 for value in lost]


def solar_economics(roof_sqft, floors, land_use, irradiance, assumptions: Assumptions = Assumptions()) -> pd.DataFrame:
    """conversion.ipynb: generation, building use, and the bill savings split into offset and export."""
    a = assumptions
    panel_m2 = np.asarray(roof_sqft, float) * SQFT_TO_M2 * a.usable_roof_fraction
    kwh = panel_m2 * np.asarray(irradiance, float) * a.panel_efficiency * a.performance_ratio
    intensity = pd.Series(land_use).map(KWH_PER_SQFT_BY_LANDUSE).fillna(DEFAULT_KWH_PER_SQFT).to_numpy()
    use = np.asarray(roof_sqft, float) * np.asarray(floors, float) * intensity
    offset = np.minimum(kwh, use)
    exported = kwh - offset
    return pd.DataFrame({'capacity_kw': panel_m2 * a.panel_efficiency,  # STC: 1 kW/m² of sunlight.
                         'kwh_per_year': kwh, 'building_kwh_per_year': use, 'kwh_offset': offset,
                         'kwh_exported': exported,
                         'usd_per_year': offset * a.rate_usd_per_kwh + exported * a.export_credit_usd_per_kwh})


def affected_buildings(frame: gpd.GeoDataFrame, raised_id: str, new_height_m: float) -> pd.Series:
    """Distance (m) to every building the raised building's new shadow could reach, nearest first."""
    distance = frame.distance(frame.geometry[raised_id]).drop(raised_id)
    reach = ((new_height_m - frame.height_m.drop(raised_id)) / math.tan(math.radians(MIN_ELEVATION_DEG))).clip(upper=MAX_REACH_M)
    return distance[(reach > 0) & (distance <= reach)].sort_values()


def simulate_height_increase(frame: gpd.GeoDataFrame, raised_id: str, added_ft: float, samples: pd.DataFrame,
                             assumptions: Assumptions = Assumptions(), targets=None,
                             max_targets: int = 60) -> pd.DataFrame:
    """Before/after solar, power and bill savings for the raised building and the neighbours it can shade.

    `targets` optionally restricts which neighbours are analysed (e.g. permit sites).
    Floors added to the raised building increase its electricity use at the same intensity.
    """
    if raised_id not in frame.index:
        raise ValueError(f'Unknown building {raised_id}')
    if not 0 <= added_ft <= 2000:
        raise ValueError('Added height must be between 0 and 2,000 ft')
    before = frame.height_m
    after = before.copy()
    after[raised_id] += added_ft * FEET_TO_METERS
    distance = affected_buildings(frame, raised_id, after[raised_id])
    if targets is not None:
        distance = distance[distance.index.isin(list(targets))]
    distance = distance.head(max_targets)
    ids = [raised_id, *distance.index]
    rows = frame.loc[ids, ['building_id', 'bin', 'height_ft', 'roof_sqft', 'floors', 'land_use', 'radiation']].copy()
    rows['role'] = ['raised', *['neighbour'] * len(distance)]
    rows['distance_m'] = [0.0, *distance.round(1)]
    rows['height_ft_after'] = after[ids] / FEET_TO_METERS
    rows['floors_after'] = rows.floors
    rows.loc[raised_id, 'floors_after'] += round(added_ft / FLOOR_HEIGHT_FT)
    losses = np.array([shading_losses(frame, i, [before, after], samples) for i in ids]).reshape(-1, 2)
    rows['shading_loss_before'], rows['shading_loss_after'] = losses[:, 0], losses[:, 1]
    # MEAN_1 already includes today's shading; otherwise start from the unshaded NYC typical value.
    a = assumptions
    radiation_median = frame.radiation.median()
    measured = (a.nyc_irradiance_kwh_m2_yr * rows.radiation / radiation_median).clip(upper=a.max_irradiance_kwh_m2_yr)
    reference = (measured / (1 - rows.shading_loss_before).clip(lower=0.05)).fillna(a.nyc_irradiance_kwh_m2_yr)
    rows['irradiance_before'] = (reference * (1 - rows.shading_loss_before)).clip(upper=a.max_irradiance_kwh_m2_yr)
    rows['irradiance_after'] = (reference * (1 - rows.shading_loss_after)).clip(upper=a.max_irradiance_kwh_m2_yr)
    for label, floors, irradiance in [('before', rows.floors, rows.irradiance_before),
                                      ('after', rows.floors_after, rows.irradiance_after)]:
        economics = solar_economics(rows.roof_sqft, floors, rows.land_use, irradiance, a)
        rows['capacity_kw'] = economics.capacity_kw.to_numpy()
        for column in ['kwh_per_year', 'building_kwh_per_year', 'usd_per_year']:
            rows[f'{column}_{label}'] = economics[column].to_numpy()
    rows['delta_kwh_per_year'] = rows.kwh_per_year_after - rows.kwh_per_year_before
    rows['delta_usd_per_year'] = rows.usd_per_year_after - rows.usd_per_year_before
    return rows.drop(columns='radiation').reset_index(drop=True)
