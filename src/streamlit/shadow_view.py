"""Cached scene preparation shared by the shadow page and its rendering proof."""
from datetime import date
from pathlib import Path
import base64
import gzip
import hashlib
import json
import numpy as np
import streamlit as st
from gismo_2026_fall_hackathon.shadows import ShadowScene, daylight_steps, load_scene
from gismo_2026_fall_hackathon.roof_solar import SolarConfig, cache_directory, load_results

SOURCE = Path(__file__).resolve().parents[2] / 'data/buildings/09_NYC_Building_Footprints.parquet'
RADIATION_SOURCE = SOURCE.with_name('18_NYC_Solar_Candidates_With_Radiation.parquet')
PERMITS_SOURCE = SOURCE.with_name('26_dob_solar_approved_permits_11142026.parquet')


def _optional_stamp(path: Path) -> tuple | None:
    try:
        stat = path.stat()
    except FileNotFoundError:
        return None
    return stat.st_mtime_ns, stat.st_size


def source_stamp() -> tuple:
    footprint = SOURCE.stat()
    return (footprint.st_mtime_ns, footprint.st_size), _optional_stamp(RADIATION_SOURCE), _optional_stamp(PERMITS_SOURCE)


@st.cache_data(max_entries=2, show_spinner=False)
def cached_scene(path: str, bounds: tuple, stamp: tuple) -> ShadowScene:
    return load_scene(path, bounds, radiation_path=RADIATION_SOURCE, permit_path=PERMITS_SOURCE)


@st.cache_data(max_entries=16, show_spinner=False)
def cached_steps(day: date, latitude: float, longitude: float) -> list[dict]:
    return daylight_steps(day, latitude, longitude)


def solar_stamp(day: date) -> tuple:
    root = cache_directory(SOURCE)
    return tuple((p.name, p.stat().st_mtime_ns, p.stat().st_size) if p.exists() else (p.name, None, None)
                 for p in [root / 'annual.parquet', root / f'day-{day.isoformat()}.npz'])


@st.cache_data(max_entries=4, show_spinner=False)
def cached_solar_results(path: str, day: date, stamp: tuple) -> dict:
    return load_results(Path(path), SolarConfig(), day)


@st.cache_data(max_entries=4, show_spinner=False)
def cached_solar(path: str, day: date, stamp: tuple) -> dict:
    results = cached_solar_results(path, day, stamp)
    annual, daily = results['annual'], results['day']
    ids = daily['ids'] if daily is not None else annual.doitt_id.to_numpy() if annual is not None else np.array([], dtype=int)
    annual_lookup = {} if annual is None else dict(zip(annual.doitt_id, annual.annual_kwh_m2))
    annual_values = [float(annual_lookup[i]) if i in annual_lookup and np.isfinite(annual_lookup[i]) else None for i in ids]
    decoded = {'ids': [str(int(i)) for i in ids], 'annual': annual_values,
               'irradiance': np.round(daily['irradiance'], 1).tolist() if daily is not None else [],
               'sunlit': np.round(daily['sunlit'], 3).tolist() if daily is not None else [],
               'valid': daily['valid'].tolist() if daily is not None else [],
               'timestamps': daily['timestamps'].tolist() if daily is not None else []}
    raw = json.dumps(decoded, separators=(',', ':'), allow_nan=False).encode()
    return {'payload': base64.b64encode(gzip.compress(raw, compresslevel=3)).decode(),
            'id': hashlib.sha256(raw).hexdigest(), 'annual': annual is not None, 'day': daily is not None,
            'computed': sum(v is not None for v in annual_values), 'root': str(results['root'])}
