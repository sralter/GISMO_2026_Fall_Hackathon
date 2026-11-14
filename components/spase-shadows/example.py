"""Synthetic acceptance scene: a tall block shadows a shorter block to its north.

Run from the repository: uv run streamlit run components/spase-shadows/example.py
"""
from datetime import date
import geopandas as gpd
import streamlit as st
from shapely.geometry import box
from gismo_2026_fall_hackathon.shadows import prepare_scene, daylight_steps
from spase_shadows import render_shadows

st.set_page_config(layout='wide')
st.title('Shadow rendering proof')
# Metre-sized geometry makes expected winter-noon shadow lengths easy to check.
origin = gpd.GeoSeries.from_xy([-73.99], [40.69], crs=4326).to_crs(32618).iloc[0]
x, y = origin.x, origin.y
frame = gpd.GeoDataFrame({'height_roo': [100 / 0.3048, 20 / 0.3048], 'doitt_id': [1, 2],
                         'bin': [3000001, 3000002], 'base_bbl': ['proof', 'proof'], 'feature_co': [2100, 2100]},
                        geometry=[box(x-20, y-20, x+20, y+20), box(x-30, y+50, x+30, y+110)], crs=32618).to_crs(4326)
bounds = tuple(gpd.GeoSeries([box(x-250, y-250, x+250, y+300)], crs=32618).to_crs(4326).total_bounds)
scene = prepare_scene(frame, bounds, bounds)
scene.spec['initialViewState'].update(zoom=17, bearing=20, pitch=55)
day = st.date_input('Date', value=date(2026, 12, 21))
shadows = st.toggle('Show shadows', value=True)
steps = daylight_steps(day, 40.69, -73.99)
slot = st.session_state.get('shadow_map', {}).get('slot', next(i for i, s in enumerate(steps) if s['noon']))
render_shadows(scene_payload=scene.payload, scene_id='proof', steps=steps, slot=slot, live=True, shadows=shadows,
               camera=None, camera_command=0)
st.caption('Tall block: 100 m. Short block: 20 m. At winter noon, the tall block shadows the shorter roof and south façade.')
