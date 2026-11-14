"""Run with: uv run streamlit run src/streamlit/Home.py"""
import streamlit as st
from explorer import DATA, ALL, get_sample

st.set_page_config(page_title='SPASE · NYC buildings', page_icon=':material/domain:', layout='wide')
page = st.navigation([
    st.Page('app_pages/presentation.py', title='Presentation', icon=':material/slideshow:', default=True,
            help='Present your slides beside a compact building demo.'),
    st.Page('app_pages/demo.py', title='Demo', icon=':material/map:', url_path='demo',
            help='Explore linked 2D footprints and 3D building surfaces; inspect and download measurements.'),
], position='top')
st.title('SPASE')
st.caption('Solar Panel Assessment and Siting Engine · NYC building explorer')

files = sorted(DATA.glob('DA*_3D_Buildings_Merged.gml'), key=lambda p: int(p.name.split('_')[0][2:]))
with st.sidebar:
    st.header('Explore buildings')
    if files:
        with st.form('source_form'):
            names = [p.name for p in files]
            default = next((i for i,n in enumerate(names) if n.startswith('DA4_')), 0)
            file_name = st.selectbox('Delivery area', names, index=default, key='source_file',
                                     format_func=lambda n: f'Delivery area {n.split("_")[0][2:]}')
            limit = st.select_slider('Sample size', options=[10, 25, 50, 100], value=25, key='sample_size')
            with st.expander('Vertical scale assumption'):
                z_scale = st.number_input('Z-to-horizontal unit scale', min_value=0.001, max_value=1000.0,
                                          value=1.0, format='%.3f', key='z_scale',
                                          help='Provisional conversion of source Z into horizontal units. A scale of 1 assumes matching units.')
            submitted = st.form_submit_button('Load sample', key='load_sample', width='stretch')
        if submitted or 'sample_config' not in st.session_state:
            st.session_state.sample_config = (str(DATA / file_name), int(limit), float(z_scale))
    else:
        st.session_state.sample_config = None
        st.info('Add the local CityGML files under data/DA_WISE_GML/DA_WISE_GMLs to explore buildings.')

sample = None
if st.session_state.get('sample_config'):
    try:
        with st.spinner('Preparing building geometry…'):
            sample = get_sample()
    except (OSError, ValueError) as exc:
        st.error(f'Could not prepare this sample: {exc}')
if sample is not None:
    with st.sidebar:
        options = [ALL, *sample.buildings.building_key.tolist()]
        labels = dict(zip(sample.buildings.building_key, sample.buildings['label']))
        labels[ALL] = 'All sampled buildings'
        if st.session_state.get('selected_building') not in options:
            st.session_state.selected_building = options[1] if len(options) > 1 else ALL
        st.selectbox('Building', options, key='selected_building', format_func=lambda k: labels[k])
        st.segmented_control('View', ['2D map', '3D buildings'], default='3D buildings', key='view_mode')
        st.segmented_control('Color by', ['Surface type', 'Inclination'], default='Surface type', key='color_by')
        st.toggle('Show basemap', value=True, key='show_basemap')
        st.caption('Geometry measurements are provisional. Solar exposure and shadowing have not been modeled.')
# Pages get the cached sample independently; this flag also handles missing data.
st.session_state.sample_available = sample is not None
page.run()
