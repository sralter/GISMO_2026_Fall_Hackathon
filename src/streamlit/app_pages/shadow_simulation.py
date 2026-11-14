"""Brooklyn shadow simulation and chatbot."""
from datetime import date
import hashlib
import streamlit as st
from shadow_view import SOURCE, cached_scene, cached_steps, source_stamp, cached_solar, solar_stamp
from gismo_2026_fall_hackathon.shadows import CAMERAS, STUDY_BOUNDS
from spase_shadows import render_shadows
from gismo_2026_fall_hackathon.roof_solar import prepare, ANNUAL_SCALE, INSTANT_SCALE
from solar_chat import render_chat, reset_chat, highlight_ids

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
                    stamp = source_stamp()
                    cached_scene(str(SOURCE), (west, south, east, north), stamp)
                    st.session_state.shadow_bounds = (west, south, east, north)
                except (OSError, ValueError) as exc:
                    st.error(str(exc))
        bounds = st.session_state.shadow_bounds

left, right = st.columns([0.4, 0.6], gap='large')
with right:
    st.subheader('Building shadows')
    st.caption('Clear-sky sunlight on roofs, façades, and ground. Drag the time slider to move the sun.')
    try:
        stamp = source_stamp()
        with st.spinner('Preparing buildings and shadow surfaces…'):
            scene = cached_scene(str(SOURCE), tuple(bounds), stamp)
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
    solar = cached_solar(str(SOURCE), day, solar_stamp(day))
    modes = {'Annual clear-sky': 'annual', 'Selected time': 'instant', "Colleague’s June 21 data": 'reference'}
    st.session_state.setdefault('shadow_color_mode', 'Annual clear-sky' if solar['annual'] else "Colleague’s June 21 data")
    mode = modes[st.segmented_control('Roof color', list(modes), key='shadow_color_mode', required=True) or 'Annual clear-sky']
    if mode != 'reference' and tuple(bounds) != STUDY_BOUNDS:
        st.info('Calculated results currently cover the default Brooklyn scene. Roofs outside that calculation are gray.')
    if mode == 'annual' and not solar['annual']:
        st.info('Annual results have not been prepared. Run the local preparation command; it resumes completed shading chunks.')
        st.code('uv run python -m gismo_2026_fall_hackathon.roof_solar --workers 4', language='bash')
    if mode == 'instant' and not solar['day']:
        st.info('This date has not been prepared. Initial shading preparation can take several minutes; subsequent dates reuse it.')
        if st.button('Prepare selected day', key='shadow_prepare_day'):
            progress = st.empty()
            try:
                prepare(SOURCE, annual=False, days=(day,), progress=progress.caption)
                st.rerun()
            except (OSError, ValueError) as exc:
                st.error(f'Could not prepare solar results: {exc}')
    center = scene.spec['initialViewState']
    steps = cached_steps(day, center['latitude'], center['longitude'])
    noon = next(i for i, step in enumerate(steps) if step['noon'])
    if st.session_state.get('shadow_last_date') != day:
        st.session_state.shadow_last_date = day
        st.session_state['shadow_map'] = {**st.session_state.get('shadow_map', {}), 'slot': noon}
    identity = repr((str(SOURCE), bounds, stamp))
    scene_id = hashlib.sha256(identity.encode()).hexdigest()
    if st.session_state.get('solar_chat', {}).get('scene_id') != scene_id:
        reset_chat(scene_id)
        st.session_state.shadow_camera = None

    @st.fragment
    def interactive_map():
        slot = st.session_state.get('shadow_map', {}).get('slot', noon)
        render_shadows(scene_payload=scene.payload, scene_id=scene_id, steps=steps,
                       slot=slot, live=live, shadows=shadows, camera=st.session_state.shadow_camera,
                       camera_command=st.session_state.shadow_camera_command,
                       highlighted_building_ids=highlight_ids(), solar_payload=solar['payload'],
                       solar_id=solar['id'], color_mode=mode)

    interactive_map()
    st.caption(f'{scene.buildings:,} buildings including the 1 km caster buffer · {scene.excluded:,} excluded · {scene.repaired:,} repaired')
    exposure = scene.spec['roofExposure']
    scale = ANNUAL_SCALE if mode == 'annual' else INSTANT_SCALE if mode == 'instant' else exposure['range']
    label = '2026 annual clear-sky solar resource · kWh/m²/year' if mode == 'annual' else 'Selected-time clear-sky irradiance · W/m²' if mode == 'instant' else 'June 21 reference exposure · units unspecified'
    if scale is not None:
        low, high = scale
        st.html(f'''<div role="img" aria-label="{label}: yellow is low, red is high; gray means unavailable">
          <div>{label}</div>
          <div style="height:12px;background:linear-gradient(to right,#ffff00,#ff8000,#ff0000)"></div>
          <div style="display:flex;justify-content:space-between"><span>{low:,.2f} · Low</span><span>High · {high:,.2f}</span></div>
          <div><span style="display:inline-block;width:12px;height:12px;background:#a0a0a0"></span> Gray: unavailable</div>
        </div>''')
    if mode == 'reference':
        st.caption(f"{exposure['measured']:,} buildings have reference exposure data. These fixed values have unspecified units.")
    else:
        st.caption('Calculated from neighboring building geometry, independently of visual shadow toggles. '
                   'Annual values integrate clear skies throughout 2026; selected-time values include direct and diffuse sunlight.')
        st.caption('5 m roof sampling · 5° sampled skylines · hourly annual integration · '
                   'additional 1 km of shading obstacles beyond the rendered scene. '
                   'Flat roofs, isotropic diffuse sky, opaque building columns; trees, roof equipment, terrain between buildings, '
                   'and reflected light are excluded. Analysis uses ground elevations; visual shadows use level ground. '
                   'This is incoming solar energy, not electricity output.')
    st.caption('Blue-gray: façades · teal outline: study area. Drag to pan; Shift + drag rotates; scroll to zoom.')
    st.caption('Flat roofs and level ground are approximations. Shadows from beyond the buffer may be missing near sunrise or sunset. No clouds or reflected-light model.')

with left:
    render_chat(scene.spec)
