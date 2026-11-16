"""Native chat UI for the shadow scene, with session-local conversation state."""
import os
import math
from datetime import date
import streamlit as st
from openai import OpenAI, OpenAIError
from gismo_2026_fall_hackathon.solar_assistant import answer_question
from gismo_2026_fall_hackathon.solar_queries import execute_tool, attach_solar_metrics
from shadow_view import cached_solar_results, solar_stamp


def setting(name: str, default: str = '') -> str:
    try:
        return str(st.secrets.get(name, os.getenv(name, default)))
    except FileNotFoundError:
        return os.getenv(name, default)


@st.cache_resource
def get_client(base_url: str) -> OpenAI:
    return OpenAI(base_url=base_url, api_key='lm-studio', timeout=120.0, max_retries=0)


def reset_chat(scene_id: str):
    st.session_state.solar_chat = {'scene_id': scene_id, 'conversation': [], 'messages': [], 'records': []}


def highlight_ids() -> list[str]:
    return [row['building_id'] for row in st.session_state.get('solar_chat', {}).get('records', [])]


def focus_camera(spec: dict, building_id: str) -> dict:
    roofs = next(layer['data'] for layer in spec['layers'] if layer['id'] == 'roofs')
    points = [point for roof in roofs if roof['building_id'] == building_id for point in roof['polygon'][0]]
    if not points:
        raise ValueError('No roof geometry for this building.')
    return {**spec['initialViewState'], 'longitude': (min(p[0] for p in points) + max(p[0] for p in points)) / 2,
            'latitude': (min(p[1] for p in points) + max(p[1] for p in points)) / 2, 'zoom': 17}


def results_camera(spec: dict, building_ids: list[str]) -> dict | None:
    ids = set(building_ids)
    roofs = next(layer['data'] for layer in spec['layers'] if layer['id'] == 'roofs')
    points = [p for roof in roofs if roof['building_id'] in ids for p in roof['polygon'][0]]
    if not points:
        return None
    west, east = min(p[0] for p in points), max(p[0] for p in points)
    south, north = min(p[1] for p in points), max(p[1] for p in points)
    latitude = (south + north) / 2
    span = max(east - west, (north - south) / math.cos(math.radians(latitude)), 0.0001)
    return {**spec['initialViewState'], 'longitude': (west + east) / 2, 'latitude': latitude,
            'zoom': min(17, math.log2(360 / span) - 2)}


@st.fragment
def render_chat(spec: dict, *, source_path: str | None = None, day: date | None = None, steps: list[dict] | None = None):
    state = st.session_state.solar_chat
    st.subheader('Ask SPASE')
    st.caption('Explore roofs in the loaded scene, including its 1 km buffer. Façade metrics are coming later.')
    st.caption('Solar potential uses annual clear-sky resource. Irradiance uses the selected map date/time when you submit a question. June 21 reference exposure remains available separately.')
    if st.button('New conversation', key='solar_reset'):
        reset_chat(state['scene_id'])
        st.rerun()
    model = setting('LOCAL_MODEL')
    if not model:
        st.info('Set LOCAL_MODEL to your loaded model ID to enable chat. The map works without a model.')
    with st.container(height=350):
        for message in state['messages']:
            with st.chat_message(message['role']):
                st.markdown(message['content'])
                for result in message.get('results', []):
                    show_result(result)
    latest = next((m['results'][-1] for m in reversed(state['messages']) if m.get('results')), None)
    if latest and latest['total_matches']:
        if st.button('Show results on map', key='solar_show_results', type='primary'):
            if 'map_building_ids' in latest:
                state['records'] = [spec['buildingInfo'][key] for key in latest['map_building_ids'] if key in spec['buildingInfo']]
            else:
                # Conversations created before snapshot support only contain the fixed roof metrics.
                result = execute_tool(latest['tool'], latest['arguments'], spec['buildingInfo'], include_count_records=True)
                state['records'] = result['records']
            camera = results_camera(spec, highlight_ids())
            if camera is not None:
                st.session_state.shadow_camera = camera
                st.session_state.shadow_camera_command += 1
            st.rerun()
    if state['records']:
        st.caption(f"{len(state['records']):,} result buildings selected; visible roofs are outlined in cyan. "
                   'Matches in the surrounding buffer may be outside the rendered map.')
        selected = st.selectbox('Result building', highlight_ids(), key='solar_focus_id')
        if st.button('Focus on map', key='solar_focus'):
            camera = results_camera(spec, [selected])
            if camera is not None:
                st.session_state.shadow_camera = focus_camera(spec, selected)
                st.session_state.shadow_camera_command += 1
                st.rerun()
            else:
                st.info('This building is in the surrounding buffer, outside the rendered map.')
    prompt = st.chat_input('Ask about roof area or solar exposure…', key='solar_prompt',
                           disabled=not model, submit_mode='disable', max_chars=4000)
    if not state['messages']:
        suggestion = st.pills('Try asking', ['How many buildings have roof areas above 500 square meters?',
                                           'Which are the top 5 buildings with the highest solar potential?'],
                              key='solar_suggestion', disabled=not model)
        prompt = prompt or suggestion
    if prompt:
        try:
            with st.spinner('Querying the building inventory…'):
                inventory, context = query_snapshot(spec, source_path, day, steps)
                answer, conversation, results = answer_question(
                    get_client(setting('LOCAL_BASE_URL', 'http://localhost:1234/v1')),
                    model, prompt, state['conversation'], inventory, context=context)
                for result in results:
                    snapshot = execute_tool(result['tool'], result['arguments'], inventory,
                                            include_count_records=True, context=result.get('context'),
                                            base_building_ids=result.get('base_building_ids'))
                    result['map_building_ids'] = [row['building_id'] for row in snapshot['records']]
            state['conversation'] = conversation
            state['messages'].extend([{'role': 'user', 'content': prompt},
                                      {'role': 'assistant', 'content': answer, 'results': results}])
            state['records'] = next((result['records'] for result in reversed(results) if result['records']), [])
            st.rerun()
        except (OpenAIError, OSError, ValueError) as exc:
            st.error(f'Local assistant: {exc}')
            st.caption('Check the server URL, loaded model ID, and tool-calling support, then submit again.')

    with st.expander('About this local assistant', expanded=False):
        st.markdown(f"""
This demonstration runs a local language model on this computer through **Bionic**,
using an OpenAI-compatible server.

- **Computer:** Apple M2, 24 GB unified memory
- **Operating system:** macOS Tahoe 26.3.1
- **Configured model:** {model or 'Not configured'}

The model interprets your question and requests read-only Python tools. Those tools
calculate counts, filters, and rankings from the loaded building and solar datasets;
the model writes the explanation. It can misunderstand a question, so check the
reported filters, units, date/time, and tool results.

Queries include the scene’s 1 km buffer. Missing solar values are excluded from
solar filters, not treated as zero. Annual resource is in kWh/m²/year; selected-time
irradiance is in W/m²; the separate June 21 reference exposure has unspecified units.
The default top percentage uses all valid buildings in the loaded scene and includes
ties at the cutoff. These are incoming solar estimates, not electricity output.

Submit time-based questions after releasing the map slider. Results and their map
selections retain the time at which the question was asked. Facade metrics are not
yet available. Chat requests are sent to the configured model server on this computer;
other app features, such as embedded slides, can still use the internet.
""")


def query_snapshot(spec: dict, source_path: str | None, day: date | None, steps: list[dict] | None):
    """Read prepared results only on submission; never trigger solar calculations."""
    if source_path is None or day is None or not steps:
        return spec['buildingInfo'], {}
    noon = next(i for i, step in enumerate(steps) if step['noon'])
    slot = st.session_state.get('shadow_map', {}).get('slot', noon)
    step = steps[max(0, min(int(slot), len(steps) - 1))]
    results = cached_solar_results(source_path, day, solar_stamp(day))
    context = {'timestamp': step['timestamp'], 'time_label': step['label'], 'annual_year': 2026}
    return attach_solar_metrics(spec['buildingInfo'], results, step['timestamp']), context


def show_result(result: dict):
    st.caption(f"Tool result · {result['total_matches']:,} matches · {result['scene_buildings']:,} buildings in the loaded scene including buffer")
    if result['records']:
        st.dataframe(result['records'], hide_index=True, alt='Buildings returned by the inventory query',
                     column_config={'roof_area_m2': st.column_config.NumberColumn('Roof area (m²)', format='%.2f'),
                                    'roof_exposure': st.column_config.NumberColumn('June 21 exposure (units unspecified)', format='%.2f'),
                                    'annual_kwh_m2': st.column_config.NumberColumn('Annual resource (kWh/m²/year)', format='%.2f'),
                                    'irradiance_w_m2': st.column_config.NumberColumn('Irradiance (W/m²)', format='%.2f')})
    if result['arguments'].get('metric') == 'roof_exposure' or 'exposure_above' in result['arguments']:
        st.caption(f"{result['measured_roofs']:,} roofs have measurements. Fixed June 21 exposure; units unspecified, not electricity output.")

    filters = result.get('applied_filters', {})
    labels = {'roof_area_above_m2': 'Roof area (m²)', 'exposure_above': 'June 21 reference exposure',
              'annual_above_kwh_m2': 'Annual resource (kWh/m²/year)', 'irradiance_above_w_m2': 'Irradiance (W/m²)'}
    conditions = [f'{label} > {filters[key]:g}' for key, label in labels.items() if key in filters]
    if conditions:
        st.caption(' AND '.join(conditions))
    metrics_used = {result['arguments'].get('metric'), filters.get('percentile_metric')}
    if 'irradiance_above_w_m2' in filters or 'irradiance_w_m2' in metrics_used:
        st.caption('Irradiance snapshot · ' + result.get('context', {}).get('time_label', 'Selected map time'))
    coverage = result.get('coverage', {})
    for field, label in [('irradiance_w_m2', 'selected-time irradiance'), ('annual_kwh_m2', 'annual clear-sky resource')]:
        if field in metrics_used or (field == 'irradiance_w_m2' and 'irradiance_above_w_m2' in filters) or (field == 'annual_kwh_m2' and 'annual_above_kwh_m2' in filters):
            st.caption(f"{coverage.get(field, 0):,} buildings have valid {label} data. Missing values are excluded.")
    if percentile := result.get('percentile'):
        population = 'loaded scene' if percentile['scope'] == 'scene' else 'filtered group'
        cutoff = 'none' if percentile['cutoff'] is None else f"{percentile['cutoff']:,.2f}"
        st.caption(f"Top {percentile['percent']:g}% of the {population} by {result['metrics'][percentile['metric']]} "
                   f"Valid population: {percentile['valid_population']:,}; cutoff: {cutoff}. Ties included.")
    counts = result.get('condition_counts', {})
    if len(counts) > 1:
        st.caption('Separate condition counts: ' + '; '.join(f"{labels.get(key, 'Top percentage')}: {value:,}" for key, value in counts.items())
                   + f". Combined: {result['total_matches']:,}.")
