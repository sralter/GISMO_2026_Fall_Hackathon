import streamlit as st
from explorer import get_sample, render_explorer, render_slides

left, right = st.columns([0.58, 0.42], gap='large')
with left:
    st.subheader('Presentation')
    render_slides()
with right:
    st.subheader('Building demo')
    st.caption('The same selected building in 2D or 3D. Use the sidebar to explore.')
    if st.session_state.get('sample_available'):
        sample = get_sample()
        if sample is not None:
            render_explorer(sample, compact=True)
    else:
        st.info('The demo needs the local CityGML dataset. Slides remain available without it.')
