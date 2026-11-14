# GISMO_2026_Fall_Hackathon
SPASE: Solar Panel Assessment and Siting Engine

## Explore the buildings

```sh
uv sync
uv run streamlit run src/streamlit/Home.py
```

Open the URL printed by Streamlit. The app includes these pages:

- **Presentation:** a Google Slides URL field beside a compact live building demo.
  Paste a published deck URL or a sharing link whose viewing permissions allow embedding.
- **Building shadows:** slides beside a live 3D sunlight/shadow simulation covering Downtown Brooklyn and Brooklyn Heights.
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
and colors are not solar suitability scores. The original explorer does not model solar exposure or shadows; use **Building shadows** for the shadow simulation.

See [the guided notebooks](sra_notebooks/README.md) for the five-stage workflow.
The new page scripts live in `src/streamlit/app_pages/`; `Home.py` is the entrypoint.
The earlier presentation placeholder has been replaced by these pages.

Checks:

```sh
uv run python -m unittest discover -s tests -v
uv run ty check --extra-search-path components/spase-shadows src/streamlit src/gismo_2026_fall_hackathon/shadows.py src/gismo_2026_fall_hackathon/map_data.py
```

## Live building shadows

Place `09_NYC_Building_Footprints.parquet` in `data/buildings/`, then open
**Building shadows**. This page works without the CityGML files. Choose a date,
use the representative summer/winter solstice buttons, and drag the **Time of day**
slider. Sunlight and GPU shadows update in the browser while dragging; Python
receives the time on release. Turn **Live shadows** off for release-only updates.
The date and time use `America/New_York`; repeated daylight-saving hours include
their timezone and UTC offset.

Roofs are gold and façades blue-gray, rendered separately for later solar-potential
colors. Shadows fall on ground, roofs, and façades. This is a clear-sky geometric
visualization, with no clouds, reflected-light calculation, or energy estimates.
Ambient illumination only keeps geometry visible. Roofs are flat, ground is level,
and source heights are converted from feet to meters. Trees and roof setbacks
are not modeled. Shadows beyond the loaded caster buffer may be incomplete at
low sun angles. At night direct sunlight and visible cast shadows are off.

The default study area covers both neighborhoods, with a 1 km surrounding caster
buffer. Use **Area → NYC area** to enter another rectangle and **Load area** to
apply it. The 20,000-building ceiling includes the buffer. Defaults and the ceiling
are centralized in `src/gismo_2026_fall_hackathon/shadows.py`; expand geographic
coverage there without changing the data loader. The complete NYC source remains
on disk and is filtered before loading geometry into memory.

The template-derived CCv2 component lives in `components/spase-shadows` and is a
local uv workspace dependency. Its pinned browser libraries are bundled into
committed assets, so `uv sync` needs no Node.js build. Geometry and the shadow map
work offline; embedding Google Slides still needs network access.

To change and rebuild the frontend (Node.js 22.16+):

```sh
cd components/spase-shadows/spase_shadows/frontend
npm ci
npm run build
```

Commit the regenerated `frontend/build` files along with source changes. To inspect
the two-building roof/wall/ground shadow acceptance scene:

```sh
uv run streamlit run components/spase-shadows/example.py
```

Deck.gl shadow mapping is experimental and requires WebGL2. The proof scene has a
100 m block south of a 20 m block; at winter noon its shadow reaches the shorter
roof and south façade. The bundled renderer retains one GPU context across time
and camera changes and frees it when the page unmounts.
