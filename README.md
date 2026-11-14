# GISMO_2026_Fall_Hackathon
SPASE: Solar Panel Assessment and Siting Engine

## Explore the buildings

```sh
uv sync
uv run streamlit run src/streamlit/Home.py
```

Open the URL printed by Streamlit. The app has two pages:

- **Presentation:** a Google Slides URL field beside a compact live building demo.
  Paste a published deck URL or a sharing link whose viewing permissions allow embedding.
- **Demo:** a full building explorer with 2D/3D switching, surface measurements,
  orientation flags, and CSV/GeoJSON downloads.

Use the sidebar to load a delivery area and a bounded sample (10–100 buildings).
Select a building, or choose all sampled buildings and click one on the map.
The selection and view controls are shared across pages. The default uses 25
buildings from delivery area 4. Sample parsing and analysis are cached locally.

The app expects the source files under `data/DA_WISE_GML/DA_WISE_GMLs/`.
Slides still work when the local dataset is absent. Basemap tiles and embedded
slides need network access; turn off **Show basemap** to inspect geometry alone.

PyDeck renders the same source identities in 2D layers and detailed 3D triangle
surfaces, including vertical walls. Red/blue/green indicate roof/wall/ground;
alternatively, color by inclination. Heights are relative to the sample base.
The Z-unit scale remains provisional, unverified compass directions are withheld,
and colors are not solar suitability scores. Solar exposure and shadows are not
modeled yet.

See [the guided notebooks](sra_notebooks/README.md) for the five-stage workflow.
The new page scripts live in `src/streamlit/app_pages/`; `Home.py` is the entrypoint.
The earlier presentation placeholder has been replaced by these pages.

Checks:

```sh
uv run python -m unittest discover -s tests -v
uv run ty check src/streamlit/Home.py src/streamlit/explorer.py src/streamlit/app_pages src/gismo_2026_fall_hackathon/map_data.py
```
