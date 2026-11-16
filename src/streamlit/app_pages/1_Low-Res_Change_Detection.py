"""Prior-project layout example for the hackathon team."""
from datetime import date, timedelta

import streamlit as st

st.header('Low-resolution satellite image change detection')
st.caption('Prior project · Samuel Alter · Reveal Global Consulting')
st.info('Layout example: Google Slides alongside a coded demo. The original data and model pipelines are not connected.')

left, right = st.columns([0.6, 0.4], gap='large')
with left:
    st.subheader('Presentation')
    st.iframe(
        'https://docs.google.com/presentation/d/e/'
        '2PACX-1vQmMn3FwndNP_l09sMVuxdWLbDrqY5UcU-E'
        'hEvb1WmYF1XwQ_OBSVXzPqL72GPofJb9Gyyjb9zpDTpo/embed'
        '?start=false&loop=false&delayms=3000',
        height=600,
        alt='Low-resolution satellite image change detection slide deck',
    )
with right:
    st.subheader('Demo placeholder')
    st.map({'lat': [40.0], 'lon': [-100.0]}, zoom=3, height=350,
           alt='Interactive map centered on the United States')
    st.text_input('Geohash (5 characters)', max_chars=5, placeholder='e.g. 9vgm0',
                  key='change_detection_geohash')
    st.caption('Illustrative input; the map does not recenter on the geohash in this placeholder.')
    today = date.today()
    before, after = st.columns(2)
    with before:
        st.date_input('Before', value=today - timedelta(days=1), max_value=today,
                      key='change_detection_before')
    with after:
        st.date_input('After', value=today, max_value=today,
                      key='change_detection_after')
    st.button('Build dataset', disabled=True, key='change_detection_build')
    st.caption('Dataset building, inspection, and inference require the original project pipelines.')
