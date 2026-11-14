"""Shared presentation/demo components. Analysis remains in the Python package."""
from pathlib import Path
import json
import math

import numpy as np
import pydeck as pdk
import streamlit as st

from gismo_2026_fall_hackathon.map_data import DisplaySample, load_display_sample, slide_embed_url

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'data' / 'DA_WISE_GML' / 'DA_WISE_GMLs'
ALL = '__all__'


@st.cache_data(max_entries=4, show_spinner=False)
def cached_sample(path: str, limit: int, z_scale: float, stamp: tuple[int, int]) -> DisplaySample:
    # The size/mtime stamp invalidates this bounded cache if local source data changes.
    return load_display_sample(path, limit, z_scale)


def get_sample() -> DisplaySample | None:
    config = st.session_state.get('sample_config')
    if config is None:
        return None
    path, limit, z_scale = config
    stat = Path(path).stat()
    return cached_sample(path, limit, z_scale, (stat.st_mtime_ns, stat.st_size))


def map_selection(chart_key: str) -> None:
    state = st.session_state.get(chart_key, {})
    for objects in state.get('selection', {}).get('objects', {}).values():
        for obj in objects:
            key = obj.get('building_key') or obj.get('properties', {}).get('building_key')
            if key:
                st.session_state.selected_building = key
                return


def build_deck(sample: DisplaySample, selected: str, mode: str, color_by: str) -> pdk.Deck:
    buildings = sample.buildings
    if selected != ALL:
        buildings = buildings[buildings.building_key == selected]
    roofs = sample.roofs[sample.roofs.building_key.isin(buildings.building_key)]
    triangles = sample.triangles[sample.triangles.building_key.isin(buildings.building_key)]
    color = 'inclination_color' if color_by == 'Inclination' else 'type_color'
    layers = []
    if mode == '2D map':
        layers.append(pdk.Layer('GeoJsonLayer', id='footprints', data=json.loads(buildings.to_json()),
            get_fill_color=[114, 155, 189, 85], get_line_color=[49, 84, 119],
            line_width_min_pixels=2, pickable=True, auto_highlight=True))
        layers.append(pdk.Layer('GeoJsonLayer', id='roofs', data=json.loads(roofs.to_json()),
            get_fill_color=f'properties.{color}', get_line_color=[70, 70, 70],
            line_width_min_pixels=1, pickable=True, auto_highlight=True))
    else:
        # full3d tessellates on a suitable plane so vertical wall triangles survive.
        layers.append(pdk.Layer('SolidPolygonLayer', id='surfaces', data=triangles,
            get_polygon='polygon', get_fill_color=color, _full3d=True,
            extruded=False, pickable=True, auto_highlight=True))
    if not triangles.empty:
        positions = np.array(triangles.polygon.tolist()).reshape(-1, 3)
        lon, lat = positions[:, :2].mean(axis=0)
        span = max(np.ptp(positions[:, 0]), np.ptp(positions[:, 1]) / max(math.cos(math.radians(lat)), 0.1), 0.00015)
        zoom = float(np.clip(math.log2(360 / span) - 2, 10, 20))
    else:
        lon, lat, zoom = -73.98, 40.75, 11
    # A local basemap-free option is intentionally supported by the UI.
    basemap = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' if st.session_state.get('show_basemap', True) else None
    tooltip = {'text': 'Building: {building_id}\nSurface: {surface_kind}\nInclination: {tilt_deg}°\nPolygon area: {area_m2} m² (provisional)'} if mode != '2D map' else {'text': 'Building: {properties.building_id}\nProvisional geometry measurements'}
    return pdk.Deck(layers=layers, initial_view_state=pdk.ViewState(latitude=float(lat), longitude=float(lon),
        zoom=zoom, pitch=55 if mode != '2D map' else 0, bearing=-15 if mode != '2D map' else 0),
        map_provider='carto' if basemap else None, map_style=basemap, tooltip=tooltip)


def render_explorer(sample: DisplaySample, *, compact: bool) -> None:
    selected = st.session_state.selected_building
    mode = st.session_state.view_mode
    color_by = st.session_state.color_by
    buildings = sample.buildings if selected == ALL else sample.buildings[sample.buildings.building_key == selected]
    surfaces = sample.surfaces[sample.surfaces.building_key.isin(buildings.building_key)]
    roof_area = float(buildings.roof_area_m2.sum())
    if not compact:
        a, b, c = st.columns(3)
        a.metric('Buildings in view', len(buildings))
        b.metric('Roof area · provisional', f'{roof_area:,.1f} m²')
        c.metric('Surface polygons', len(surfaces))
    chart_key = 'presentation_map' if compact else 'demo_map'
    st.pydeck_chart(build_deck(sample, selected, mode, color_by), key=chart_key,
                    height=420 if compact else 570, on_select=lambda: map_selection(chart_key),
                    selection_mode='single-object', alt=f'{mode} of selected NYC buildings colored by {color_by.lower()}')
    if color_by == 'Surface type':
        st.caption('Red: roofs · blue: walls / footprints · green: ground')
    else:
        st.caption('Inclination: teal 0° (horizontal) → amber 90° (vertical)')
    st.caption('Drag to pan; scroll to zoom. In 3D, Shift + drag rotates the view. Click a building to select it.')
    if compact:
        st.caption(f'{len(buildings)} building(s) · {roof_area:,.1f} m² of roof, provisional')
        return
    st.subheader('Surface measurements')
    st.caption('A flat roof has no compass azimuth. Other missing azimuths indicate unverified direction.')
    columns = ['building_id', 'surface_id', 'surface_kind', 'area_m2', 'tilt_deg',
               'azimuth_true_deg', 'normal_status', 'measurements_provisional', 'feature_key']
    st.dataframe(surfaces[columns], hide_index=True, alt='Selected building surface areas, inclinations, and orientation checks')
    d1, d2, d3 = st.columns(3)
    d1.download_button('Download surface CSV', surfaces.to_csv(index=False), 'surfaces.csv', 'text/csv', key='download_surfaces')
    d2.download_button('Download footprints', buildings.to_json(), 'buildings.geojson', 'application/geo+json', key='download_buildings')
    roofs = sample.roofs[sample.roofs.building_key.isin(buildings.building_key)]
    d3.download_button('Download roof GeoJSON', roofs.to_json(), 'roofs.geojson', 'application/geo+json', key='download_roofs')
    with st.expander('Geometry checks and source'):
        st.caption(f'Source: {sample.source}. First {len(sample.buildings)} meshed building records; this is a sample, not citywide coverage.')
        st.caption('Heights are metres above the sample base using a provisional Z scale, not terrain-referenced elevations. Source winding is preserved; unverified azimuths are withheld.')
        st.caption('The mesh uses exact source vertices. Edge matching may fail at T-junctions or almost-equal vertices without proving the source model is unusable.')
        if not sample.issues.empty:
            st.dataframe(sample.issues, hide_index=True, alt='Source extraction and orientation flags for the sample')
        else:
            st.caption('No extraction or orientation flags in this sample.')


def render_slides() -> None:
    url = st.text_input('Google Slides URL', key='slides_url', persist_state='session',
                        placeholder='Paste a sharing link or published presentation URL')
    if url:
        embed = slide_embed_url(url)
        if embed:
            st.iframe(embed, height=560, alt='SPASE presentation slide deck')
        else:
            st.error('Enter an HTTPS Google Slides link from docs.google.com/presentation/d/.')
    else:
        with st.container(border=True, height=560):
            st.subheader('SPASE')
            st.markdown('Solar Panel Assessment and Siting Engine')
            st.markdown('Explore NYC buildings from their roofs to their façades.')
            st.divider()
            st.markdown('**The workflow**\n\nInspect → Parse → Transform → Analyze → Visualize')
            st.markdown('Use the demo beside this presentation to inspect real building geometry and surface measurements.')
            st.caption('Paste your Google Slides link above when the deck is ready.')
