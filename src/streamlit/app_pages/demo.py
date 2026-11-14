import streamlit as st
from explorer import get_sample, render_explorer

st.subheader('NYC building explorer')
st.info('Areas and inclinations use a provisional vertical scale. Colors describe geometry, not solar suitability.')
if st.session_state.get('sample_available'):
    sample = get_sample()
    if sample is not None:
        render_explorer(sample, compact=False)
else:
    st.info('Choose an available CityGML delivery area to load a sample.')
