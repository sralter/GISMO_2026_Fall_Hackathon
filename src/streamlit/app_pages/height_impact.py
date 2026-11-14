"""Raise one building and see how its new shadow changes neighbours' solar output and bill savings.

Run on its own with: uv run streamlit run src/streamlit/app_pages/height_impact.py
"""
from dataclasses import fields
import json

import geopandas as gpd
import pandas as pd
import pydeck as pdk
import streamlit as st
from pvlib.solarposition import get_solarposition
from shapely.geometry import Point

from gismo_2026_fall_hackathon import height_impact
from gismo_2026_fall_hackathon.height_impact import (
    Assumptions, affected_buildings, load_footprints, load_permit_sites, shadow_polygon, simulate_height_increase,
    sun_samples)
from gismo_2026_fall_hackathon.shadows import FEET_TO_METERS, METRIC_CRS, TIMEZONE

st.set_page_config(page_title='SPASE · Height impact', page_icon=':material/apartment:', layout='wide')
SOURCE, PERMITS = height_impact.FOOTPRINTS_PATH, height_impact.PERMITS_PATH
PERMIT_MODE, ALL_MODE = 'Solar permit sites', 'All nearby footprints'
MAX_TARGETS = 60
SITE_RADIUS_M = 300
CENTER = (-73.9875, 40.6935)  # Downtown Brooklyn, matching the shadow page.
PREVIEWS = {'Dec 21 · 9 AM': '2026-12-21 09:00', 'Dec 21 · noon': '2026-12-21 12:00',
            'Dec 21 · 3 PM': '2026-12-21 15:00', 'Jun 21 · noon': '2026-06-21 12:00'}


def stamp_of(path) -> tuple | None:
    try:
        stat = path.stat()
    except FileNotFoundError:
        return None
    return stat.st_mtime_ns, stat.st_size


@st.cache_resource(max_entries=2, show_spinner=False)
def footprints(path: str, stamp: tuple) -> gpd.GeoDataFrame:
    return load_footprints(path)


@st.cache_data(max_entries=2, show_spinner=False)
def permit_sites(path: str, stamp: tuple, footprint_path: str, footprint_stamp: tuple) -> pd.DataFrame:
    frame = footprints(footprint_path, footprint_stamp)
    sites = load_permit_sites(path, frame)
    sites['neighbours'] = [int((frame.distance(frame.geometry[i]) <= SITE_RADIUS_M).sum() - 1) for i in sites.index]
    return sites


@st.cache_data(show_spinner=False)
def samples() -> pd.DataFrame:
    return sun_samples()


@st.cache_data(max_entries=32, show_spinner=False)
def scenario(path: str, stamp: tuple, raised_id: str, added_ft: float, assumptions: Assumptions,
             targets: tuple | None) -> pd.DataFrame:
    return simulate_height_increase(footprints(path, stamp), raised_id, added_ft, samples(), assumptions,
                                    targets=targets, max_targets=MAX_TARGETS)


stamp = stamp_of(SOURCE)
if stamp is None:
    st.error(f'Add {SOURCE.name} under data/ to run height scenarios.')
    st.stop()
with st.spinner('Loading building footprints and permits…'):
    frame = footprints(str(SOURCE), stamp)
    permit_stamp = stamp_of(PERMITS)
    sites = permit_sites(str(PERMITS), permit_stamp, str(SOURCE), stamp) if permit_stamp else pd.DataFrame()
label = lambda i: f"BIN {frame.at[i, 'bin'] or '—'} · {frame.at[i, 'height_ft']:,.0f} ft · DOITT {i}"

with st.sidebar:
    st.header('Height scenario')
    modes = [PERMIT_MODE, ALL_MODE] if len(sites) else [ALL_MODE]
    mode = st.radio('Measure impact on', modes, key='impact_mode')
    site_id = None
    if mode == PERMIT_MODE:
        site_ids = sites.sort_values('address').index.tolist()
        site_id = st.selectbox('Permit site', site_ids, index=site_ids.index(sites.neighbours.idxmax()), key='impact_site',
                               format_func=lambda i: f"{sites.at[i, 'address']} · {sites.at[i, 'permits']} permit(s)",
                               help='Buildings with approved DOB solar permits, matched to footprints by BIN.')
        near = frame.distance(frame.geometry[site_id]).drop(site_id)
        near = near[near <= SITE_RADIUS_M].sort_values()
        if near.empty:
            st.warning(f'No other footprints within {SITE_RADIUS_M} m of this site.')
            st.stop()
        options = near.index.tolist()
        # Shade comes from the south in NYC, so start with the nearest building south of the site.
        site_y = frame.geometry[site_id].centroid.y
        south = [i for i in options if frame.geometry[i].centroid.y < site_y]
        default_id = south[0] if south else options[0]
        option_label = lambda i: f'{label(i)} · {near[i]:,.0f} m away'
    else:
        options = frame.sort_values('bin').index.tolist()
        center = gpd.GeoSeries([Point(*CENTER)], crs='OGC:CRS84').to_crs(METRIC_CRS).iloc[0]
        default_id = frame.distance(center).idxmin()
        option_label = label
    with st.form('impact_form'):
        raised_id = st.selectbox('Building to raise', options, index=options.index(default_id), format_func=option_label,
                                 key=f'impact_building_{site_id or "all"}', help='Type a BIN to search.')
        added_ft = st.slider('Added height (ft)', 0, 600, 200, step=10, key='impact_added_ft')
        with st.expander('Cost assumptions · conversion.ipynb'):
            defaults = Assumptions()
            values = {f.name: st.number_input(f.name.replace('_', ' ').capitalize(), value=float(getattr(defaults, f.name)),
                                              min_value=0.0, format='%.3f', key=f'impact_{f.name}')
                      for f in fields(Assumptions)}
        run = st.form_submit_button('Run scenario', key='impact_run', width='stretch')
    context = (mode, site_id)
    if run or st.session_state.get('impact_config', {}).get('context') != context:
        st.session_state.impact_config = dict(context=context, raised_id=raised_id, added_ft=float(added_ft),
                                              assumptions=Assumptions(**values))

config = st.session_state.impact_config
raised_id, added_ft, assumptions = config['raised_id'], config['added_ft'], config['assumptions']
targets = tuple(sites.index) if mode == PERMIT_MODE else None
noun = 'Permit sites' if targets else 'Neighbours'
st.subheader('Building height impact')
st.caption('Raise one building and estimate how its taller shadow changes rooftop solar output, system power and '
           'utility-bill savings' + (' at buildings with approved DOB solar permits.' if targets else ' around it.'))
with st.spinner('Tracing a year of shadows…'):
    result = scenario(str(SOURCE), stamp, raised_id, added_ft, assumptions, targets)
if len(sites):
    result['address'] = result.building_id.map(sites.address)
raised, neighbours = result.iloc[0], result.iloc[1:]
shaded = neighbours[neighbours.delta_kwh_per_year < -1]

a, b, c, d = st.columns(4)
a.metric(f'{noun} losing sun', f'{len(shaded)} of {len(neighbours)}',
         help='Of the buildings the raised building\'s new shadow could reach.')
b.metric(f'{noun} solar change', f'{neighbours.delta_kwh_per_year.sum():,.0f} kWh/yr')
c.metric(f'{noun} savings change', f'${neighbours.delta_usd_per_year.sum():,.0f}/yr')
d.metric('Raised building savings change', f'${raised.delta_usd_per_year:,.0f}/yr',
         help='Added floors raise its electricity use, so more of its solar offsets retail-rate power.')
if not targets:
    reachable = len(affected_buildings(frame, raised_id, frame.at[raised_id, 'height_m'] + added_ft * FEET_TO_METERS))
    if reachable > len(neighbours):
        st.caption(f'Analysed the nearest {len(neighbours)} of {reachable} buildings the new shadow could reach.')
if site_id is not None and site_id not in set(neighbours.building_id):
    st.info('The selected permit site is outside this building\'s shadow reach. '
            'Try a larger added height or a closer building to the south.')

# Map: buildings at their scenario heights; red intensity shows each building's savings loss.
preview = st.segmented_control('Shadow preview', list(PREVIEWS), default='Dec 21 · noon', key='impact_preview')
radius = max(float(SITE_RADIUS_M), (float(neighbours.distance_m.max()) if len(neighbours) else 0.0) + 100)
nearby = frame[frame.distance(frame.geometry[raised_id]) <= radius].copy()
loss = result.set_index('building_id').delta_usd_per_year.clip(upper=0)
worst = max(-loss.min(), 1.0)
is_site = nearby.index.isin(sites.index) if len(sites) else [False] * len(nearby)
nearby['height_m'] = nearby.height_m + (nearby.index == raised_id) * added_ft * FEET_TO_METERS
nearby['color'] = [[230, 120, 40] if i == raised_id else
                   [200, int(200 * (1 + loss[i] / worst)), int(200 * (1 + loss[i] / worst))] if loss.get(i, 0) < 0 else
                   [42, 150, 140] if site else [170, 175, 180] for i, site in zip(nearby.index, is_site)]
nearby['label'] = [f"{sites.at[i, 'address']}\n{label(i)}" if site else label(i) for i, site in zip(nearby.index, is_site)]
nearby['change'] = [f'${loss.get(i, 0):,.0f}/yr' for i in nearby.index]
layers = []
if preview:
    when = pd.DatetimeIndex([pd.Timestamp(PREVIEWS[preview], tz=TIMEZONE)])
    lon, lat = gpd.GeoSeries([frame.geometry[raised_id].centroid], crs=METRIC_CRS).to_crs(4326).iloc[0].coords[0]
    sun = get_solarposition(when, lat, lon).iloc[0]
    shadow = shadow_polygon(frame.geometry[raised_id], nearby.at[raised_id, 'height_m'], sun.azimuth, sun.apparent_elevation)
    if shadow is not None:
        shadow = gpd.GeoDataFrame(geometry=[shadow], crs=METRIC_CRS).to_crs(4326)
        layers.append(pdk.Layer('GeoJsonLayer', id='shadow', data=json.loads(shadow.to_json()),
                                get_fill_color=[40, 40, 60, 90], stroked=False))
mapped = nearby[['geometry', 'height_m', 'color', 'label', 'change']].to_crs(4326)
layers.append(pdk.Layer('GeoJsonLayer', id='buildings', data=json.loads(mapped.to_json()), extruded=True,
                        get_elevation='properties.height_m', get_fill_color='properties.color',
                        pickable=True, auto_highlight=True))
if len(sites):
    points = sites[sites.index.isin(nearby.index)].dropna(subset=['latitude', 'longitude'])
    layers.append(pdk.Layer('ScatterplotLayer', id='permits', data=points[['longitude', 'latitude']].to_dict('records'),
                            get_position=['longitude', 'latitude'], get_fill_color=[20, 90, 160], get_radius=6))
lon, lat = mapped.geometry[raised_id].centroid.coords[0]
st.pydeck_chart(pdk.Deck(layers=layers, initial_view_state=pdk.ViewState(longitude=lon, latitude=lat, zoom=15.5, pitch=50, bearing=-20),
                         map_provider='carto', map_style='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                         tooltip={'text': '{label}\nSavings change: {change}'}),
                height=520, key='impact_map', alt='3D map of the raised building and the buildings its shadow reaches')
st.caption('Orange: raised building · red: buildings losing savings (darker is larger) · teal: unaffected permit sites · '
           'blue dots: permit locations · gray: other footprints. The dark patch is the raised building\'s ground '
           'shadow at the preview time. Shift + drag rotates.')

table = result.assign(shading_loss_before=result.shading_loss_before * 100, shading_loss_after=result.shading_loss_after * 100)
columns = {'role': 'Role', 'address': 'Permit address', 'bin': 'BIN', 'distance_m': 'Distance (m)', 'height_ft': 'Height (ft)',
           'height_ft_after': 'Height after (ft)', 'shading_loss_before': 'Sun lost before (%)',
           'shading_loss_after': 'Sun lost after (%)', 'irradiance_before': 'Irradiance before (kWh/m²/yr)',
           'irradiance_after': 'Irradiance after (kWh/m²/yr)', 'capacity_kw': 'System size (kW)',
           'kwh_per_year_before': 'Solar before (kWh/yr)', 'kwh_per_year_after': 'Solar after (kWh/yr)',
           'delta_kwh_per_year': 'Δ solar (kWh/yr)', 'usd_per_year_before': 'Savings before ($/yr)',
           'usd_per_year_after': 'Savings after ($/yr)', 'delta_usd_per_year': 'Δ savings ($/yr)'}
columns = {k: v for k, v in columns.items() if k in table}
st.dataframe(table[list(columns)].rename(columns=columns).round(1), hide_index=True,
             alt='Per-building solar, power and bill savings before and after the height change')
st.download_button('Download results CSV', result.to_csv(index=False), 'height_impact.csv', 'text/csv', key='impact_download')
with st.expander('Method and limits'):
    st.caption('Sun: clear sky, hourly on the 21st of each month. A roof loses the direct sunlight that falls inside '
               'taller buildings\' shadows; diffuse sky light is not reduced. Sun below 5° is ignored.')
    st.caption('Energy and savings follow conversion.ipynb: 30% of the roof gets 20%-efficient panels at an 80% '
               'performance ratio. Solar offsetting the building\'s own use saves the retail rate; excess earns the export credit.')
    st.caption('Permit sites are DOB solar permits matched to footprints by BIN. Only solar-candidate footprints are '
               'modelled, so shade from other buildings is missing and most permitted homes are not in this dataset. '
               'Roofs are flat; heights come from footprint roof height, or floors × 10 ft when missing.')
