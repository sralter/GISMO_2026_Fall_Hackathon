"""Streamlit CCv2 adapter for a PyDeck scene with live GPU shadows."""
import streamlit as st

_renderer = st.components.v2.component(
    'spase-shadows.spase_shadows', js='index-*.js', css='index-*.css',
    html='''
    <div class="shadow-root" role="region" aria-label="3D buildings with sunlight and shadows">
      <div class="shadow-canvas" aria-label="Interactive 3D building map"></div>
      <div class="shadow-controls">
        <label>Time of day<input type="range" min="0" step="1" aria-label="Time of day" /></label>
        <output aria-live="off"></output>
        <div class="shadow-status" role="status">Preparing 3D scene…</div>
      </div>
    </div>
    ''',
)


def render_shadows(*, scene_payload: str, scene_id: str, steps: list[dict], slot: int,
                   shadows: bool, live: bool, camera: dict | None, camera_command: int,
                   key: str = 'shadow_map'):
    """Mount a scene; synchronize time to Python only after a slider release."""
    loaded = st.session_state.get(key, {}).get('loaded_scene_id') == scene_id
    return _renderer(key=key, data=dict(scene='' if loaded else scene_payload, scene_id=scene_id, steps=steps, slot=slot,
                     shadows=shadows, live=live, camera=camera, camera_command=camera_command),
                     on_slot_change=lambda: None, on_loaded_scene_id_change=lambda: None)
