"""Cached scene preparation shared by the shadow page and its rendering proof."""
from datetime import date
from pathlib import Path
import streamlit as st
from gismo_2026_fall_hackathon.shadows import ShadowScene, daylight_steps, load_scene

SOURCE = Path(__file__).resolve().parents[2] / 'data/buildings/09_NYC_Building_Footprints.parquet'


@st.cache_data(max_entries=2, show_spinner=False)
def cached_scene(path: str, bounds: tuple, stamp: tuple[int, int]) -> ShadowScene:
    return load_scene(path, bounds)


@st.cache_data(max_entries=16, show_spinner=False)
def cached_steps(day: date, latitude: float, longitude: float) -> list[dict]:
    return daylight_steps(day, latitude, longitude)
