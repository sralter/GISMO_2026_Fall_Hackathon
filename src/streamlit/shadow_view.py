"""Cached scene preparation shared by the shadow page and its rendering proof."""
from datetime import date
from pathlib import Path
import streamlit as st
from gismo_2026_fall_hackathon.shadows import ShadowScene, daylight_steps, load_scene

SOURCE = Path(__file__).resolve().parents[2] / 'data/buildings/09_NYC_Building_Footprints.parquet'
RADIATION_SOURCE = SOURCE.with_name('18_NYC_Solar_Candidates_With_Radiation.parquet')


def source_stamp() -> tuple:
    footprint = SOURCE.stat()
    try:
        radiation = RADIATION_SOURCE.stat()
        radiation_stamp = (radiation.st_mtime_ns, radiation.st_size)
    except FileNotFoundError:
        radiation_stamp = None
    return (footprint.st_mtime_ns, footprint.st_size), radiation_stamp


@st.cache_data(max_entries=2, show_spinner=False)
def cached_scene(path: str, bounds: tuple, stamp: tuple) -> ShadowScene:
    return load_scene(path, bounds, radiation_path=RADIATION_SOURCE)


@st.cache_data(max_entries=16, show_spinner=False)
def cached_steps(day: date, latitude: float, longitude: float) -> list[dict]:
    return daylight_steps(day, latitude, longitude)
