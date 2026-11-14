# example
import pydeck as pdk

layer = pdk.Layer(
    "GeoJsonLayer",
    selected,
    stroked=True,
    filled=True,
    get_fill_color=[255, 180, 40, 160],
    get_line_color=[255, 255, 255],
    pickable=True,
)

st.pydeck_chart(
    pdk.Deck(
        layers=[layer],
        initial_view_state=pdk.ViewState(
            latitude=40.695,
            longitude=-73.990,
            zoom=14,
            pitch=45,
        ),
    )
)