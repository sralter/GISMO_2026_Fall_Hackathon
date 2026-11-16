"""Offline clear-sky roof resource. Building-derived horizons are independent of GPU shadows.

Run: python -m gismo_2026_fall_hackathon.roof_solar --help
"""
from __future__ import annotations

import argparse
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from datetime import date, timedelta
import hashlib
import json
import math
import fcntl
from pathlib import Path
from typing import Any, Callable

import geopandas as gpd
import numpy as np
import pandas as pd
from pvlib.location import Location
from pyproj import Proj
from shapely import make_valid
from shapely.geometry import MultiPolygon, box

from .shadows import (BUFFER_M, FEET_TO_METERS, METRIC_CRS, STUDY_BOUNDS, TIMEZONE,
                      _polygons, buffered_bounds)

SOURCE = Path(__file__).resolve().parents[2] / 'data/buildings/09_NYC_Building_Footprints.parquet'
MODEL_VERSION = 1
CHUNK_ROOFS = 128
ANNUAL_SCALE = (0., 2200.)
INSTANT_SCALE = (0., 1200.)


@dataclass(frozen=True)
class SolarConfig:
    year: int = 2026
    spacing_m: float = 5.
    azimuth_step_deg: float = 5.
    caster_buffer_m: float = 1000.
    bounds: tuple = STUDY_BOUNDS

    def __post_init__(self):
        if not 2000 <= self.year <= 2100:
            raise ValueError('Choose a year from 2000 to 2100.')
        if not math.isfinite(self.spacing_m) or self.spacing_m <= 0:
            raise ValueError('Roof spacing must be positive and finite.')
        if (not math.isfinite(self.azimuth_step_deg) or not 0 < self.azimuth_step_deg <= 30
                or not math.isclose(360 / self.azimuth_step_deg, round(360 / self.azimuth_step_deg))):
            raise ValueError('Azimuth step must divide 360 and be at most 30 degrees.')
        if not math.isfinite(self.caster_buffer_m) or self.caster_buffer_m < 1000:
            raise ValueError('Use at least a 1 km additional caster buffer.')
        buffered_bounds(self.bounds)


def cache_directory(source: Path = SOURCE, config: SolarConfig = SolarConfig()) -> Path:
    stat = source.stat()
    identity = {'source': str(source.resolve()), 'size': stat.st_size, 'mtime_ns': stat.st_mtime_ns,
                'model_version': MODEL_VERSION, **asdict(config)}
    digest = hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()[:20]
    return source.parent / 'roof_solar' / digest


def _atomic_npz(path: Path, **arrays):
    # Atomic replacement lets readers keep using the last complete result.
    temporary = path.with_suffix('.tmp.npz')
    np.savez_compressed(temporary, **arrays)
    temporary.replace(path)


def sample_roof(geometry, spacing_m: float) -> tuple[np.ndarray, np.ndarray]:
    """Interior sample per clipped grid cell, weighted by its exact polygon area."""
    points, weights = [], []
    for polygon in _polygons(geometry):
        west, south, east, north = polygon.bounds
        for x in np.arange(math.floor(west / spacing_m) * spacing_m, east, spacing_m):
            for y in np.arange(math.floor(south / spacing_m) * spacing_m, north, spacing_m):
                clipped = polygon.intersection(box(x, y, x + spacing_m, y + spacing_m))
                for part in _polygons(clipped):
                    if part.area > 1e-8:
                        point = part.representative_point()
                        points.append((point.x, point.y))
                        weights.append(part.area)
    return np.asarray(points, dtype=float).reshape(-1, 2), np.asarray(weights)


def clean_buildings(frame: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    frame = frame.to_crs(METRIC_CRS).copy()
    geometries, statuses = [], []
    for row in frame.itertuples():
        geometry = row.geometry
        if geometry is None or geometry.is_empty:
            geometry, status = None, 'invalid geometry'
        else:
            parts = list(_polygons(make_valid(geometry)))
            geometry = MultiPolygon(parts) if parts else None
            status = 'ok' if geometry is not None and geometry.area > 0 else 'invalid geometry'
        if not np.isfinite(row.height_roo) or row.height_roo <= 0 or row.feature_co == 1003:
            status = 'unusable height or feature'
        elif not np.isfinite(row.ground_ele):
            status = 'missing ground elevation'
        geometries.append(geometry)
        statuses.append(status)
    frame.geometry = geometries
    frame['status'] = statuses
    frame['roof_z'] = (frame.ground_ele + frame.height_roo) * FEET_TO_METERS
    frame['roof_area_m2'] = frame.area
    frame['doitt_id'] = frame.doitt_id.astype('int64')
    if not frame.doitt_id.is_unique:
        raise ValueError('Footprint building IDs must be unique.')
    return frame.sort_values('doitt_id').reset_index(drop=True)


class HorizonIndex:
    """VTK wall intersections recover the skyline of opaque footprint columns.

    Columns extend below the lowest receiver: terrain outside footprints is not modeled.
    Horizon sampling is an approximation; refine azimuth spacing for narrow obstacles.
    """
    def __init__(self, buildings: gpd.GeoDataFrame):
        import vtk
        from vtkmodules.util.numpy_support import numpy_to_vtk, numpy_to_vtkIdTypeArray
        self.vtk = vtk
        vertices, faces, tops = [], [], []
        bottom = float(buildings.ground_ele.min() * FEET_TO_METERS - 1)
        self.extent = buildings.total_bounds
        for geometry, top in zip(buildings.geometry, buildings.roof_z):
            for polygon in _polygons(geometry):
                for ring in [polygon.exterior, *polygon.interiors]:
                    coords = np.asarray(ring.coords)[:, :2]
                    for a, b in zip(coords[:-1], coords[1:]):
                        k = len(vertices)
                        vertices.extend([(a[0], a[1], bottom), (b[0], b[1], bottom),
                                         (b[0], b[1], top), (a[0], a[1], top)])
                        faces.extend([(3, k, k + 1, k + 2), (3, k, k + 2, k + 3)])
                        tops.extend([top, top])
        self.tops = np.asarray(tops)
        self.length = float(np.linalg.norm(self.extent[2:] - self.extent[:2]) + 1)
        points = vtk.vtkPoints()
        points.SetData(numpy_to_vtk(np.asarray(vertices), deep=True))
        cells = vtk.vtkCellArray()
        cells.ImportLegacyFormat(numpy_to_vtkIdTypeArray(np.asarray(faces, dtype=np.int64).ravel(), deep=True))
        self.mesh = vtk.vtkPolyData()
        self.mesh.SetPoints(points)
        self.mesh.SetPolys(cells)
        self.locator = vtk.vtkStaticCellLocator()
        self.locator.SetDataSet(self.mesh)
        self.locator.BuildLocator()

    def horizons(self, origins: np.ndarray, azimuth_step_deg: float) -> np.ndarray:
        cell = self.vtk.vtkGenericCell()
        # VTK's stubs omit its mutable numeric reference wrappers.
        hit_t: Any = self.vtk.reference(0.)
        sub_id: Any = self.vtk.reference(0)
        cell_id: Any = self.vtk.reference(0)
        hit, pcoords = [0., 0., 0.], [0., 0., 0.]
        result = np.zeros((len(origins), round(360 / azimuth_step_deg)), dtype=np.float32)
        for j, azimuth in enumerate(np.deg2rad(np.arange(result.shape[1]) * azimuth_step_deg)):
            offset = np.array([math.sin(azimuth), math.cos(azimuth), 0.]) * self.length
            for i, origin in enumerate(origins):
                slope = 0.
                # Raise the ray above each encountered roof until the sky is clear.
                # Nearest-hit queries avoid enumerating every wall along a horizontal ray.
                while True:
                    offset[2] = self.length * slope
                    if not self.locator.IntersectWithLine(origin, origin + offset, 1e-7,
                                                         hit_t, hit, pcoords, sub_id, cell_id, cell):
                        break
                    distance = math.hypot(hit[0] - origin[0], hit[1] - origin[1])
                    height = self.tops[int(cell_id)] - origin[2]
                    next_slope = height / max(distance, 1e-6)
                    # VTK can return the same edge within its intersection tolerance.
                    # A ray already above that roof must not loop on a coincident face.
                    if next_slope <= slope + 1e-8:
                        break
                    slope = next_slope + 1e-6 * max(1., next_slope)
                result[i, j] = math.degrees(math.atan(slope))
        return result


def solar_weather(times: pd.DatetimeIndex, bounds=STUDY_BOUNDS) -> pd.DataFrame:
    location = Location((bounds[1] + bounds[3]) / 2, (bounds[0] + bounds[2]) / 2, TIMEZONE)
    position = location.get_solarposition(times)
    weather = location.get_clearsky(times, model='ineichen', solar_position=position)
    weather['elevation'] = position.apparent_elevation
    # VTK uses projected grid north; pvlib azimuths use true north.
    convergence = Proj(METRIC_CRS).get_factors(location.longitude, location.latitude).meridian_convergence
    weather['azimuth'] = (position.azimuth - convergence) % 360
    return weather.fillna(0.)


def annual_times(year: int, minutes: int = 60) -> pd.DatetimeIndex:
    start = pd.Timestamp(year=year, month=1, day=1, tz=TIMEZONE).tz_convert('UTC')
    end = pd.Timestamp(year=year + 1, month=1, day=1, tz=TIMEZONE).tz_convert('UTC')
    return pd.date_range(start, end, freq=f'{minutes}min', inclusive='left') + pd.Timedelta(minutes=minutes / 2)


def day_times(day: date) -> pd.DatetimeIndex:
    start = pd.Timestamp(day).tz_localize(TIMEZONE)
    end = pd.Timestamp(day + timedelta(days=1)).tz_localize(TIMEZONE)
    return pd.date_range(start, end, freq='15min', inclusive='left')


def evaluate(horizon: np.ndarray, owners: np.ndarray, weights: np.ndarray,
             count: int, weather: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
    """Roof-average irradiance and sunlit area fractions; bounded to one time step."""
    areas = np.bincount(owners, weights=weights, minlength=count)
    sky_samples = np.mean(np.cos(np.deg2rad(horizon)) ** 2, axis=1)
    sky = np.divide(np.bincount(owners, weights=weights * sky_samples, minlength=count), areas,
                    out=np.zeros(count), where=areas > 0)
    irradiance = np.zeros((len(weather), count), dtype=np.float32)
    sunlit = np.zeros_like(irradiance)
    for i, (dni, dhi, elevation, azimuth) in enumerate(weather[['dni', 'dhi', 'elevation', 'azimuth']].itertuples(index=False, name=None)):
        if elevation <= 0:
            continue
        position = (azimuth % 360) / 360 * horizon.shape[1]
        left = int(position)
        fraction = position - left
        skyline = horizon[:, left] * (1 - fraction) + horizon[:, (left + 1) % horizon.shape[1]] * fraction
        lit_area = np.bincount(owners, weights=weights * (elevation > skyline), minlength=count)
        sunlit[i] = np.divide(lit_area, areas, out=np.zeros(count), where=areas > 0)
        irradiance[i] = max(dni, 0) * math.sin(math.radians(elevation)) * sunlit[i] + max(dhi, 0) * sky
    return irradiance, sunlit


_INDEX: HorizonIndex | None = None


def _init_index(path: str):
    global _INDEX
    _INDEX = HorizonIndex(gpd.read_parquet(path))


def _prepare_chunk(task: tuple[str, int, float, float]):
    directory, chunk, spacing, azimuth_step = task
    root = Path(directory)
    target = root / f'horizon-{chunk:04d}.npz'
    if target.exists():
        return chunk
    frame = gpd.read_parquet(root / 'receivers.parquet').iloc[chunk * CHUNK_ROOFS:(chunk + 1) * CHUNK_ROOFS]
    coordinates, weights, owners = [], [], []
    for owner, row in enumerate(frame.itertuples()):
        if row.status != 'ok':
            continue
        xy, areas = sample_roof(row.geometry, spacing)
        coordinates.extend(np.column_stack([xy, np.full(len(xy), row.roof_z + .02)]))
        weights.extend(areas)
        owners.extend([owner] * len(xy))
    points = np.asarray(coordinates).reshape(-1, 3)
    if _INDEX is None:
        raise RuntimeError('Shading index is not initialized.')
    horizon = _INDEX.horizons(points, azimuth_step)
    _atomic_npz(target, ids=frame.doitt_id.to_numpy(), owners=np.asarray(owners, dtype=np.int64),
                weights=np.asarray(weights), horizon=horizon)
    return chunk


def _prepare(source: Path = SOURCE, config: SolarConfig = SolarConfig(), *, annual: bool = True,
            days: tuple[date, ...] = (), workers: int = 4,
            progress: Callable[[str], object] = print) -> Path:
    """Checkpoint horizons by roof chunk, then derive annual/day files without tracing again."""
    root = cache_directory(source, config)
    root.mkdir(parents=True, exist_ok=True)
    receiver_bounds = buffered_bounds(config.bounds)
    caster_bounds = buffered_bounds(receiver_bounds, config.caster_buffer_m)
    columns = ['doitt_id', 'height_roo', 'ground_ele', 'feature_co', 'geometry']
    if not all((root / name).exists() for name in ['receivers.parquet', 'casters.parquet', 'metadata.json']):
        receivers = clean_buildings(gpd.read_parquet(source, columns=columns, bbox=receiver_bounds))
        casters = clean_buildings(gpd.read_parquet(source, columns=columns, bbox=caster_bounds))
        excluded_casters = int((casters.status != 'ok').sum())
        casters = casters[casters.status == 'ok']
        if casters.empty:
            raise ValueError('No usable shading geometry.')
        # Only the receivers rendered by the simulator need results.
        receivers = receivers[receivers.status != 'unusable height or feature'].reset_index(drop=True)
        for name, frame in [('casters', casters), ('receivers', receivers)]:
            temporary = root / f'{name}.tmp.parquet'
            frame.to_parquet(temporary)
            temporary.replace(root / f'{name}.parquet')
        geometry_hash = hashlib.sha256()
        for geometry, height in zip(casters.geometry.to_wkb(), casters.roof_z):
            geometry_hash.update(geometry)
            geometry_hash.update(np.float64(height).tobytes())
        metadata = {**asdict(config), 'model_version': MODEL_VERSION, 'receiver_bounds': receiver_bounds,
                    'caster_bounds': caster_bounds, 'casters': len(casters),
                    'excluded_casters': excluded_casters,
                    'geometry_fingerprint': geometry_hash.hexdigest(),
                    'solar_azimuth': 'true north corrected to EPSG:32618 grid north',
                    'method': 'area-weighted roof samples; azimuth skyline interpolation; isotropic sky visibility',
                    'annual_units': 'kWh/m²/year', 'instant_units': 'W/m²', 'weather': 'Ineichen clear sky'}
        temporary = root / 'metadata.tmp.json'
        temporary.write_text(json.dumps(metadata, indent=2))
        temporary.replace(root / 'metadata.json')
    receivers = gpd.read_parquet(root / 'receivers.parquet')
    if receivers.empty:
        raise ValueError('No roof receivers in this area.')
    chunks = math.ceil(len(receivers) / CHUNK_ROOFS)
    pending = [(str(root), i, config.spacing_m, config.azimuth_step_deg) for i in range(chunks)
               if not (root / f'horizon-{i:04d}.npz').exists()]
    if pending:
        progress(f'Preparing shading for {len(receivers):,} roofs in {len(pending)} remaining chunks.')
        if workers == 1:
            _init_index(str(root / 'casters.parquet'))
            results = map(_prepare_chunk, pending)
            for done, _ in enumerate(results, 1):
                progress(f'Shading chunks {chunks - len(pending) + done}/{chunks}')
        else:
            with ProcessPoolExecutor(max_workers=workers, initializer=_init_index,
                                     initargs=(str(root / 'casters.parquet'),)) as pool:
                futures = [pool.submit(_prepare_chunk, task) for task in pending]
                for done, future in enumerate(as_completed(futures), 1):
                    future.result()
                    progress(f'Shading chunks {chunks - len(pending) + done}/{chunks}')
    operations: list[tuple[Path, pd.DatetimeIndex, float | None]] = []
    if annual and not (root / 'annual.parquet').exists():
        operations.append((root / 'annual.parquet', annual_times(config.year), 1.))
    for day in days:
        if not (root / f'day-{day.isoformat()}.npz').exists():
            operations.append((root / f'day-{day.isoformat()}.npz', day_times(day), None))
    for target, times, hours in operations:
        weather = solar_weather(times, config.bounds)
        values, lit_values = [], []
        for i in range(chunks):
            with np.load(root / f'horizon-{i:04d}.npz') as data:
                irradiance, lit = evaluate(data['horizon'], data['owners'], data['weights'], len(data['ids']), weather)
                if hours is not None:
                    values.append(irradiance.sum(axis=0, dtype=np.float64) * hours / 1000)
                else:
                    values.append(irradiance)
                    lit_values.append(lit)
            progress(f'{target.stem}: {i + 1}/{chunks}')
        if hours is not None:
            result = pd.DataFrame(receivers[['doitt_id', 'roof_area_m2', 'status']])
            result['annual_kwh_m2'] = np.concatenate(values)
            result.loc[result.status != 'ok', 'annual_kwh_m2'] = np.nan
            temporary = target.with_suffix('.tmp.parquet')
            result.to_parquet(temporary, index=False)
            temporary.replace(target)
        else:
            _atomic_npz(target, ids=receivers.doitt_id.to_numpy(), timestamps=times.as_unit('ms').asi8,
                        irradiance=np.concatenate(values, axis=1), sunlit=np.concatenate(lit_values, axis=1),
                        valid=(receivers.status == 'ok').to_numpy())
    return root


def prepare(source: Path = SOURCE, config: SolarConfig = SolarConfig(), *, annual: bool = True,
            days: tuple[date, ...] = (), workers: int = 4,
            progress: Callable[[str], object] = print) -> Path:
    if workers < 1:
        raise ValueError('Use at least one worker.')
    root = cache_directory(source, config)
    root.mkdir(parents=True, exist_ok=True)
    with (root / 'prepare.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('Solar preparation is already running for this dataset. Let it finish, then reload.') from None
        return _prepare(source, config, annual=annual, days=days, workers=workers, progress=progress)


def load_results(source: Path = SOURCE, config: SolarConfig = SolarConfig(), day: date | None = None) -> dict:
    root = cache_directory(source, config)
    annual = pd.read_parquet(root / 'annual.parquet') if (root / 'annual.parquet').exists() else None
    result = {'annual': annual, 'day': None, 'root': root}
    if day is not None and (root / f'day-{day.isoformat()}.npz').exists():
        with np.load(root / f'day-{day.isoformat()}.npz') as data:
            result['day'] = {key: data[key] for key in data.files}
    return result


def validate_resolution(source: Path = SOURCE, config: SolarConfig = SolarConfig(),
                        progress: Callable[[str], object] = print) -> dict:
    """Compare a deterministic cross-section with finer spatial/angular/time sampling."""
    root = cache_directory(source, config)
    receivers = gpd.read_parquet(root / 'receivers.parquet')
    eligible = receivers[(receivers.status == 'ok') & (receivers.roof_area_m2 <= 2000)].sort_values('roof_z')
    if eligible.empty:
        raise ValueError('No usable roofs for resolution comparison.')
    subset = eligible.iloc[np.unique(np.linspace(0, len(eligible) - 1, min(12, len(eligible))).astype(int))]
    index = HorizonIndex(gpd.read_parquet(root / 'casters.parquet'))
    hourly = solar_weather(annual_times(config.year), config.bounds)
    finer_time = solar_weather(annual_times(config.year, 15), config.bounds)
    rows = []
    for row in subset.itertuples():
        totals = []
        for spacing, angular in [(config.spacing_m, config.azimuth_step_deg),
                                  (config.spacing_m / 2, config.azimuth_step_deg / 2)]:
            xy, weights = sample_roof(row.geometry, spacing)
            origins = np.column_stack([xy, np.full(len(xy), row.roof_z + .02)])
            horizon = index.horizons(origins, angular)
            owners = np.zeros(len(xy), dtype=np.int64)
            irradiance, _ = evaluate(horizon, owners, weights, 1, hourly)
            totals.append(float(irradiance.sum(dtype=np.float64) / 1000))
        irradiance, _ = evaluate(horizon, owners, weights, 1, finer_time)
        fine_total = float(irradiance.sum(dtype=np.float64) * .25 / 1000)
        rows.append({'doitt_id': int(row.doitt_id), 'default_kwh_m2': totals[0],
                     'finer_geometry_kwh_m2': totals[1], 'finer_time_kwh_m2': fine_total,
                     'geometry_difference_percent': abs(totals[0] - totals[1]) / totals[1] * 100,
                     'time_difference_percent': abs(totals[1] - fine_total) / fine_total * 100})
        progress(f"Validated {len(rows)}/{len(subset)} roofs")
    report = {'roofs': rows, 'mean_geometry_difference_percent': float(np.mean([r['geometry_difference_percent'] for r in rows])),
              'max_geometry_difference_percent': max(r['geometry_difference_percent'] for r in rows),
              'mean_time_difference_percent': float(np.mean([r['time_difference_percent'] for r in rows])),
              'max_time_difference_percent': max(r['time_difference_percent'] for r in rows),
              'note': '12 roofs spanning roof elevations, area <= 2000 m²; convergence check, not external ground truth'}
    (root / 'validation.json').write_text(json.dumps(report, indent=2))
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=SOURCE)
    parser.add_argument('--year', type=int, default=2026)
    parser.add_argument('--spacing', type=float, default=5.)
    parser.add_argument('--azimuth-step', type=float, default=5.)
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--day', type=date.fromisoformat, action='append')
    parser.add_argument('--day-only', action='store_true')
    parser.add_argument('--validate-only', action='store_true', help='Compare 12 roofs at half the spatial/angular spacing and 15-minute integration')
    args = parser.parse_args()
    config = SolarConfig(year=args.year, spacing_m=args.spacing, azimuth_step_deg=args.azimuth_step)
    if args.validate_only:
        print(json.dumps(validate_resolution(args.source, config), indent=2))
        return
    days = tuple(args.day or [date(args.year, 6, 21), date(args.year, 12, 21)])
    print(prepare(args.source, config, annual=not args.day_only, days=days, workers=args.workers,
                  progress=lambda message: print(message, flush=True)))


if __name__ == '__main__':
    main()
