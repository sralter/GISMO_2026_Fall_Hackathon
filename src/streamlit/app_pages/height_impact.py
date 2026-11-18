"""Raise one building and see how its new height changes nearby roofs' solar output and bill savings.

Run on its own with: uv run streamlit run src/streamlit/app_pages/height_impact.py
"""
from dataclasses import fields
from datetime import datetime
from pathlib import Path
import json

import geopandas as gpd
import pandas as pd
import pydeck as pdk
import streamlit as st
from pvlib.solarposition import get_solarposition
from shapely.geometry import Point

from gismo_2026_fall_hackathon import height_impact, roof_solar
from gismo_2026_fall_hackathon.height_impact import (
    SITE_RADIUS_M, Assumptions, annual_weather, load_footprints, load_permit_sites, price_scenario,
    shade_scenario, shadow_polygon)
from gismo_2026_fall_hackathon.shadows import (
    FEET_TO_METERS, METRIC_CRS, IMPACT_AREA_NAME, IMPACT_BOUNDS, PERMIT_COLOR, TIMEZONE)

st.set_page_config(page_title='SPASE · Height impact', page_icon=':material/apartment:', layout='wide')
SOURCE, PERMITS = height_impact.FOOTPRINTS_PATH, height_impact.PERMITS_PATH
PERMIT_MODE, ALL_MODE = 'Near a solar permit site', 'Any building in the impact area'
CENTER = ((IMPACT_BOUNDS[0] + IMPACT_BOUNDS[2]) / 2, (IMPACT_BOUNDS[1] + IMPACT_BOUNDS[3]) / 2)
PREVIEW_DATES = {'Dec 21': '2026-12-21', 'Mar 20': '2026-03-20', 'Jun 21': '2026-06-21'}
PREVIEW_TIMES = {'8 AM': '08:00', '10 AM': '10:00', 'Noon': '12:00', '2 PM': '14:00', '4 PM': '16:00'}
MIN_LOSS_USD = 1.0  # Smaller savings losses are treated as unaffected on the map.
# Default building to raise: a 54 ft lot (no permit) among the Downtown towers, beside the 25 Schermerhorn St permit roof.
DEMO_BIN = '3002606'


def stamp_of(path) -> tuple | None:
    try:
        stat = path.stat()
    except FileNotFoundError:
        return None
    return stat.st_mtime_ns, stat.st_size


def file_date(stamp: tuple | None) -> str:
    return datetime.fromtimestamp(stamp[0] / 1e9).strftime('%b %d, %Y') if stamp else 'missing'


@st.cache_resource(max_entries=2, show_spinner=False)
def footprints(path: str, stamp: tuple) -> gpd.GeoDataFrame:
    return load_footprints(path)


@st.cache_data(max_entries=2, show_spinner=False, persist='disk')
def permit_sites(path: str, stamp: tuple, footprint_path: str, footprint_stamp: tuple) -> pd.DataFrame:
    """Every permit roof in the loaded footprints; only study-area sites are offered as picks."""
    frame = footprints(footprint_path, footprint_stamp)
    sites = load_permit_sites(path, frame)
    sites['neighbours'] = [int((frame.distance(frame.geometry[i]) <= SITE_RADIUS_M).sum() - 1)
                           if inside else 0 for i, inside in zip(sites.index, sites.in_study_area)]
    return sites


@st.cache_data(show_spinner=False)
def weather() -> pd.DataFrame:
    return annual_weather()


# Persisted to disk so demo scenarios load instantly after a restart. The model files' stamps are part of
# the key, so editing the model never serves stale results.
MODEL_STAMP = tuple(stamp_of(Path(module.__file__)) for module in (height_impact, roof_solar))


@st.cache_data(max_entries=32, show_spinner=False, persist='disk')
def shading(path: str, stamp: tuple, raised_id: str, added_ft: float, permit_ids: tuple,
            model_stamp: tuple) -> tuple[pd.DataFrame, pd.Series]:
    # model_stamp is passed explicitly: Streamlit only hashes arguments given at the call, not defaults.
    # Pricing runs outside the cache, so editing an assumption does not trace skylines again.
    return shade_scenario(footprints(path, stamp), raised_id, added_ft, weather(), permit_ids)


stamp = stamp_of(SOURCE)
if stamp is None:
    st.error(f'Add {SOURCE.name} under data/buildings/ to run height scenarios.')
    st.stop()
with st.spinner('Loading building footprints and permits…'):
    frame = footprints(str(SOURCE), stamp)
    permit_stamp = stamp_of(PERMITS)
    sites = permit_sites(str(PERMITS), permit_stamp, str(SOURCE), stamp) if permit_stamp else pd.DataFrame()
picks = sites[sites.in_study_area] if len(sites) else sites
permit_ids = tuple(sites.index)
label = lambda i: f"BIN {frame.at[i, 'bin'] or '—'} · {frame.at[i, 'height_ft']:,.0f} ft · DOITT {i}"
demo_id = next(iter(frame.index[(frame.bin == DEMO_BIN) & frame.in_study_area]), None)

with st.sidebar:
    st.header('Height scenario')
    modes = [ALL_MODE, PERMIT_MODE] if len(picks) else [ALL_MODE]
    mode = st.radio('Building to raise', modes, key='impact_mode')
    site_id = None
    if mode == PERMIT_MODE:
        site_ids = picks.sort_values('address').index.tolist()
        default_site = (frame.loc[picks.index].distance(frame.geometry[demo_id]).idxmin() if demo_id is not None
                        else picks.neighbours.idxmax())
        site_id = st.selectbox('Permit site', site_ids, index=site_ids.index(default_site), key='impact_site',
                               format_func=lambda i: f"{picks.at[i, 'address']} · {picks.at[i, 'permits']} permit(s)",
                               help=f'Buildings in the {IMPACT_AREA_NAME} impact area with approved DOB solar permits, '
                                    'matched to footprints by BIN.')
        near = frame.distance(frame.geometry[site_id]).drop(site_id)
        near = near[near <= SITE_RADIUS_M].sort_values()
        if near.empty:
            st.warning(f'No other footprints within {SITE_RADIUS_M:,.0f} m of this site.')
            st.stop()
        options = near.index.tolist()
        # Shade comes from the south in NYC, so start with the nearest building south of the site.
        site_y = frame.geometry[site_id].centroid.y
        south = [i for i in options if frame.geometry[i].centroid.y < site_y]
        default_id = demo_id if demo_id in options else south[0] if south else options[0]
        option_label = lambda i: f'{label(i)} · {near[i]:,.0f} m away'
    else:
        study = frame[frame.in_study_area]
        options = study.sort_values('bin').index.tolist()
        center = gpd.GeoSeries([Point(*CENTER)], crs='OGC:CRS84').to_crs(METRIC_CRS).iloc[0]
        default_id = demo_id if demo_id in options else study.distance(center).idxmin()
        option_label = label
    with st.form('impact_form'):
        raised_id = st.selectbox('Building to raise', options, index=options.index(default_id), format_func=option_label,
                                 key=f'impact_building_{site_id or "all"}', help='Type a BIN to search.')
        added_ft = st.slider('Added height (ft)', 0, 600, 0, step=10, key='impact_added_ft')
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
st.subheader('Building height impact')
st.caption('Clear-sky estimate of the solar and savings nearby roofs lose when one building is raised.')
with st.spinner('Tracing skylines for the roofs the new height can shade…'):
    shaded, zone = shading(str(SOURCE), stamp, raised_id, added_ft, permit_ids, MODEL_STAMP)
result = price_scenario(shaded, assumptions)
if len(sites):
    result.insert(1, 'address', result.building_id.map(sites.address))
lost = lambda column: max(0.0, -float(column.sum()))
for title, group in [('Permit roofs', result[result.is_permit]), ('Other roofs · lost potential', result[~result.is_permit])]:
    st.markdown(f'**{title}**')
    a, b, c = st.columns(3)
    a.metric('Losing sun', f'{int((group.delta_kwh_per_year < -1).sum())} of {len(group)}',
             help='Of the roofs in the raised building\'s shadow zone.')
    b.metric('Solar lost', f'{lost(group.delta_kwh_per_year):,.0f} kWh/yr')
    c.metric('Savings lost', f'${lost(group.delta_usd_per_year):,.0f}/yr')
st.caption(f'Scored all {len(result):,} roofs in the shadow zone.')
if site_id is not None and site_id not in set(result.building_id):
    st.info('The selected permit site is outside this building\'s shadow zone. '
            'Try a larger added height or a closer building to the south.')

# Map: buildings at their scenario heights; red intensity shows each roof's savings loss.
day_column, time_column = st.columns([0.4, 0.6])
preview_day = day_column.segmented_control('Shadow preview date', list(PREVIEW_DATES), default='Dec 21',
                                           key='impact_preview_date')
preview_time = time_column.segmented_control('Time', list(PREVIEW_TIMES), default='Noon', key='impact_preview_time')
preview = preview_day and preview_time and f'{PREVIEW_DATES[preview_day]} {PREVIEW_TIMES[preview_time]}'
# Only buildings in the shadow zone are drawn; the pale basemap shows everything outside it.
nearby = frame.loc[[raised_id, *zone.index]].copy()
loss = result.set_index('building_id').delta_usd_per_year.clip(upper=0)
worst = max(-loss.min(), 1.0) if len(loss) else 1.0
is_site = nearby.index.isin(permit_ids)
nearby['height_m'] = nearby.height_m + (nearby.index == raised_id) * added_ft * FEET_TO_METERS
# Pink at the smallest counted loss, full red at the scenario's worst.
loss_color = lambda usd: [220, int(160 * (1 + usd / worst)), int(160 * (1 + usd / worst))]
nearby['color'] = [[230, 120, 40] if i == raised_id else
                   loss_color(loss[i]) if loss.get(i, 0) <= -MIN_LOSS_USD else
                   [42, 150, 140] if site else [170, 175, 180] for i, site in zip(nearby.index, is_site)]
nearby['label'] = [f"{sites.at[i, 'address']}\n{label(i)}" if site else label(i) for i, site in zip(nearby.index, is_site)]
nearby['change'] = [f'${loss.get(i, 0):,.0f}/yr' for i in nearby.index]
layers = []
if preview:
    when = pd.DatetimeIndex([pd.Timestamp(preview, tz=TIMEZONE)])
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
# Outline permit roofs as on the Building shadows page, slightly above the roof so it stays visible.
permit_roofs = mapped[is_site]
outlines = [{'path': [[x, y, height + 0.2] for x, y, *_ in polygon.exterior.coords]}
            for geometry, height in zip(permit_roofs.geometry, permit_roofs.height_m)
            for polygon in getattr(geometry, 'geoms', [geometry])]
layers.append(pdk.Layer('PathLayer', id='permit-roofs', data=outlines, get_path='path', get_color=PERMIT_COLOR,
                        get_width=2, width_units='"pixels"', pickable=False))
lon, lat = mapped.geometry[raised_id].centroid.coords[0]
st.pydeck_chart(pdk.Deck(layers=layers, initial_view_state=pdk.ViewState(longitude=lon, latitude=lat, zoom=15.5, pitch=50, bearing=-20),
                         map_provider='carto', map_style='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                         tooltip={'text': '{label}\nSavings change: {change}'}),
                height=520, key='impact_map', alt='3D map of the raised building and the roofs its new height shades')
st.caption('Orange: raised · pink to red: losing savings ($1+/yr) · teal: unaffected permit roofs · gray: other roofs in the zone · '
           'blue outline: solar permit roof. '
           'Dark patch: ground shadow at the preview time.')

table = result.assign(sun_lost_before=result.sun_lost_before * 100, sun_lost_after=result.sun_lost_after * 100)
columns = {'address': 'Permit address', 'bin': 'BIN', 'is_permit': 'Permit roof', 'distance_m': 'Distance (m)',
           'height_ft': 'Height (ft)', 'sun_lost_before': 'Sun blocked before (%)', 'sun_lost_after': 'Sun blocked after (%)',
           'annual_kwh_m2_before': 'Sunlight before (kWh/m²/yr)', 'annual_kwh_m2_after': 'Sunlight after (kWh/m²/yr)',
           'capacity_kw': 'System size (kW)', 'kwh_per_year_before': 'Solar before (kWh/yr)',
           'kwh_per_year_after': 'Solar after (kWh/yr)', 'delta_kwh_per_year': 'Δ solar (kWh/yr)',
           'usd_per_year_before': 'Savings before ($/yr)', 'usd_per_year_after': 'Savings after ($/yr)',
           'delta_usd_per_year': 'Δ savings ($/yr)'}
columns = {k: v for k, v in columns.items() if k in table}
st.dataframe(table[list(columns)].rename(columns=columns).round(1), hide_index=True,
             alt='Per-roof clear-sky sunlight, solar output and bill savings before and after the height change')
st.download_button('Download results CSV', result.to_csv(index=False), 'height_impact.csv', 'text/csv', key='impact_download')
with st.expander('Method and limits', expanded=True):
    st.caption('**Clear-sky estimate**, same model as Building shadows. Weather, trees and rooftop equipment are not '
               'modeled; roofs are flat.')
    st.caption('$ rates and the 12 kWh/sqft building use are uncited assumptions.')
    st.caption(f'Sources: {SOURCE.name} ({file_date(stamp)}), {PERMITS.name} ({file_date(permit_stamp)}).')
