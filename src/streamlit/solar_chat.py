"""Native chat UI for the shadow scene, with session-local conversation state."""
import os
import streamlit as st
from openai import OpenAI, OpenAIError
from gismo_2026_fall_hackathon.solar_assistant import answer_question


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


@st.fragment
def render_chat(spec: dict):
    state = st.session_state.solar_chat
    st.subheader('Ask SPASE')
    st.caption('Explore roofs in the loaded scene, including its 1 km buffer. Façade metrics are coming later.')
    st.caption('Chat exposure rankings use the June 21 reference dataset, independently of the map’s roof color mode.')
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
        if state['records']:
            selected = st.selectbox('Result building', highlight_ids(), key='solar_focus_id')
            if st.button('Focus on map', key='solar_focus'):
                st.session_state.shadow_camera = focus_camera(spec, selected)
                st.session_state.shadow_camera_command += 1
                st.rerun()
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
                answer, conversation, results = answer_question(
                    get_client(setting('LOCAL_BASE_URL', 'http://localhost:1234/v1')),
                    model, prompt, state['conversation'], spec['buildingInfo'])
            state['conversation'] = conversation
            state['messages'].extend([{'role': 'user', 'content': prompt},
                                      {'role': 'assistant', 'content': answer, 'results': results}])
            state['records'] = next((result['records'] for result in reversed(results) if result['records']), [])
            st.rerun()
        except (OpenAIError, ValueError) as exc:
            st.error(f'Local assistant: {exc}')
            st.caption('Check the server URL, loaded model ID, and tool-calling support, then submit again.')


def show_result(result: dict):
    st.caption(f"Tool result · {result['total_matches']:,} matches · {result['scene_buildings']:,} buildings in the loaded scene including buffer")
    if result['records']:
        st.dataframe(result['records'], hide_index=True, alt='Buildings returned by the inventory query',
                     column_config={'roof_area_m2': st.column_config.NumberColumn('Roof area (m²)', format='%.2f'),
                                    'roof_exposure': st.column_config.NumberColumn('June 21 exposure (units unspecified)', format='%.2f')})
    if result['arguments'].get('metric') == 'roof_exposure' or 'exposure_above' in result['arguments']:
        st.caption(f"{result['measured_roofs']:,} roofs have measurements. Fixed June 21 exposure; units unspecified, not electricity output.")
