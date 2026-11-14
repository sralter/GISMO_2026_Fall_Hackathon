"""Presentation and independent Brooklyn shadow simulation."""
from datetime import date
import hashlib
import streamlit as st
from explorer import render_slides
from shadow_view import SOURCE, cached_scene, cached_steps
from gismo_2026_fall_hackathon.shadows import CAMERAS, STUDY_BOUNDS
from spase_shadows import render_shadows

st.session_state.setdefault('shadow_date', date(2026, 6, 21))
st.session_state.setdefault('shadow_bounds', STUDY_BOUNDS)
st.session_state.setdefault('shadow_camera_command', 0)
st.session_state.setdefault('shadow_camera', None)

with st.sidebar:
    st.header('Sunlight and area')
    if st.button('Summer solstice', key='shadow_summer', width='stretch'):
        st.session_state.shadow_date = date(st.session_state.shadow_date.year, 6, 21)
    if st.button('Winter solstice', key='shadow_winter', width='stretch'):
        st.session_state.shadow_date = date(st.session_state.shadow_date.year, 12, 21)
    day = st.date_input('Date · New York time', key='shadow_date', min_value=date(2000, 1, 1), max_value=date(2100, 12, 31))
    st.caption('Presets use representative solstice dates: June 21 and December 21.')
    live = st.toggle('Live shadows', value=True, key='shadow_live', help='Turn off to update only when you release the time slider.')
    shadows = st.toggle('Show shadows', value=True, key='shadow_enabled')
    area = st.selectbox('Area', ['Brooklyn study area', 'NYC area'], key='shadow_area')
    if area == 'Brooklyn study area':
        bounds = STUDY_BOUNDS
    else:
        with st.form('shadow_area_form'):
            st.caption('Choose a NYC rectangle. The 1 km buffer also counts toward the 20,000-building limit.')
            west = st.number_input('West longitude', value=STUDY_BOUNDS[0], format='%.6f', key='shadow_west')
            east = st.number_input('East longitude', value=STUDY_BOUNDS[2], format='%.6f', key='shadow_east')
            south = st.number_input('South latitude', value=STUDY_BOUNDS[1], format='%.6f', key='shadow_south')
            north = st.number_input('North latitude', value=STUDY_BOUNDS[3], format='%.6f', key='shadow_north')
            if st.form_submit_button('Load area', key='shadow_load'):
                # Keep the previous scene when a requested area is invalid or too large.
                try:
                    stat = SOURCE.stat()
                    cached_scene(str(SOURCE), (west, south, east, north), (stat.st_mtime_ns, stat.st_size))
                    st.session_state.shadow_bounds = (west, south, east, north)
                except (OSError, ValueError) as exc:
                    st.error(str(exc))
        bounds = st.session_state.shadow_bounds

left, right = st.columns([0.4, 0.6], gap='large')
with left:
    st.subheader('Presentation')
    render_slides()
with right:
    st.subheader('Building shadows')
    st.caption('Clear-sky sunlight on roofs, façades, and ground. Drag the time slider to move the sun.')
    try:
        stat = SOURCE.stat()
        with st.spinner('Preparing buildings and shadow surfaces…'):
            scene = cached_scene(str(SOURCE), tuple(bounds), (stat.st_mtime_ns, stat.st_size))
    except FileNotFoundError:
        st.error('Add 09_NYC_Building_Footprints.parquet under data/buildings to load this map.')
        st.stop()
    except (OSError, ValueError) as exc:
        st.error(f'Could not prepare buildings: {exc}')
        st.stop()
    cameras = st.columns(3)
    for column, name in zip(cameras, CAMERAS):
        if column.button(name, key=f'shadow_camera_{name}', width='stretch'):
            st.session_state.shadow_camera = scene.spec['initialViewState'] if name == 'Overview' else CAMERAS[name]
            st.session_state.shadow_camera_command += 1
    center = scene.spec['initialViewState']
    steps = cached_steps(day, center['latitude'], center['longitude'])
    noon = next(i for i, step in enumerate(steps) if step['noon'])
    if st.session_state.get('shadow_last_date') != day:
        st.session_state.shadow_last_date = day
        st.session_state['shadow_map'] = {**st.session_state.get('shadow_map', {}), 'slot': noon}
    identity = repr((str(SOURCE), bounds, stat.st_mtime_ns, stat.st_size))
    scene_id = hashlib.sha256(identity.encode()).hexdigest()

    @st.fragment
    def interactive_map():
        slot = st.session_state.get('shadow_map', {}).get('slot', noon)
        render_shadows(scene_payload=scene.payload, scene_id=scene_id, steps=steps,
                       slot=slot, live=live, shadows=shadows, camera=st.session_state.shadow_camera,
                       camera_command=st.session_state.shadow_camera_command)

    interactive_map()
    st.caption(f'{scene.buildings:,} buildings including the 1 km caster buffer · {scene.excluded:,} excluded · {scene.repaired:,} repaired')
    st.caption('Gold: roofs · blue-gray: façades · teal outline: study area. Drag to pan; Shift + drag rotates; scroll to zoom.')
    st.caption('Flat roofs and level ground are approximations. Shadows from beyond the buffer may be missing near sunrise or sunset. No clouds or reflected-light model.')
