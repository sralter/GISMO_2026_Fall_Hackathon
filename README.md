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

The **Roof color** control offers annual clear-sky solar resource (kWh/m²/year),
selected-time clear-sky irradiance (W/m²), and the colleague’s June 21 reference.
Each uses a yellow–orange–red ramp; gray means unavailable. Façades remain blue-gray. Reference exposure comes from `MEAN_1` in
`18_NYC_Solar_Candidates_With_Radiation.parquet`, joined to footprints by `doitt_id`.
Its 246 populated values match `MEAN` in `07_Brooklyn_Rooftop_Solar_Table.parquet`
via the candidate IDs in layer 16; layer 17 contains identical exposure values.
The measurements cover 145 Manhattan and 101 Brooklyn roofs, including 147 in the
default buffered scene. The ramp uses the complete measurement range across all
map extents. The reference PDF supports the palette direction, but does not
document units or numeric class boundaries; values are shown with units unspecified.
Reference exposure stays fixed when the simulation date or time changes.
The calculated views use their own units and do not mix in reference values.

Prepare calculated results locally (no API keys, weather downloads, or uploads):

```sh
uv run python -m gismo_2026_fall_hackathon.roof_solar --workers 4
```

This prepares 2026 annual results and June 21/December 21 at 15-minute intervals.
The expensive geometry calculation checkpoints 128 roofs at a time, so the same
command resumes interrupted work. Four processes build local VTK spatial indexes;
use `--workers 1` to reduce peak memory. Allow several minutes or longer for first
preparation. Annual integration and subsequent dates reuse the saved skylines.
For another date, use **Prepare selected day** in the page or:

```sh
uv run python -m gismo_2026_fall_hackathon.roof_solar --day-only --day 2026-09-22
uv run python -m gismo_2026_fall_hackathon.roof_solar --validate-only
```

The analysis covers the default rendered Brooklyn scene, with an additional 1 km
of surrounding shading obstacles. It samples roof cells at 5 m, weighted by their
clipped area, and calculates each sample’s skyline from VTK intersections with
neighboring footprint columns. Skylines are sampled every 5° and interpolated in
azimuth. Roof elevations include ground elevation, and sun azimuths are corrected
from true north to projected grid north. Clear-sky direct radiation is reduced by
the sunlit area fraction; isotropic diffuse radiation is reduced by cosine-weighted
sky visibility. Hourly midpoint samples integrate annual resource. Nighttime
values are zero. These calculations are independent of the visual shadow toggle.
After a day is loaded, the slider updates roof colors and popup values in the browser.

Results live under `data/buildings/roof_solar/<fingerprint>/`, which is ignored by
Git. Metadata records the model, units, sampling, caster extent, and exclusions;
the fingerprint includes the source file stamp and model configuration. Original
Parquets remain unchanged. `annual.parquet` contains building ID, roof area,
status, and annual kWh/m²; `day-YYYY-MM-DD.npz` holds aligned building IDs,
timestamps, irradiance, sunlit fractions, and validity flags. Horizon chunks support
resume, and `validation.json` reports finer-resolution comparisons on 12 roofs.
Invalid geometry, height, or ground elevation remains explicitly unavailable.
The UI currently reads the default 2026 Brooklyn cache; other map extents may
contain roofs outside that calculation. The CLI also accepts `--year`, `--spacing`,
and `--azimuth-step` for separate experiments.

The model assumes flat roofs, opaque building columns, an isotropic diffuse sky,
and clear skies throughout the year. It omits terrain between buildings, trees,
roof equipment, reflections, panel layout, and electrical losses. Finite caster
coverage and sampled skylines can miss distant or narrow obstacles. Outputs
estimate incoming sunlight, not weather-adjusted generation or electricity.
Visual geometry retains its level-ground approximation, so displayed shadows can
differ from calculations that include ground elevations.

Roof popups show total flat-roof area in m², computed from the repaired footprint
in the metric scene CRS, subtracting courtyard holes and summing multipart roofs.
This is geometric roof area, not usable solar-panel area. Façade area is deferred.

Visual shadows fall on ground, roofs, and façades. The shadow renderer is separate
from the solar resource calculation described above; its pixels do not measure energy.
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

## Local roof chatbot

On **Building shadows**, chat below the slides queries the loaded building scene,
including its 1 km caster buffer. Ask for counts above a roof-area threshold, top
roofs by area or exposure, or details by building ID. Returned buildings have cyan
roof outlines; choose a result and click **Focus on map** to inspect it. A new
loaded area or dataset resets the conversation; changing date/time does not.

Start your Bionic/LM Studio OpenAI-compatible server with a tool-capable model,
then launch the app from the same computer:

```sh
LOCAL_MODEL=qwen2.5-coder-7b-instruct-mlx uv run streamlit run src/streamlit/Home.py
```

The default endpoint is `http://localhost:1234/v1`. Override `LOCAL_BASE_URL` if
needed. `LOCAL_MODEL` and `LOCAL_BASE_URL` can also be set in an uncommitted
`.streamlit/secrets.toml` (secrets take precedence). No hosted API key is needed.
To check the exact model IDs your server advertises:

```sh
curl http://localhost:1234/v1/models
```

The endpoint must be reachable **from the Streamlit server**, not just your browser.
If chat reports an error, check the server is running, the exact model ID is loaded,
and the model/server supports Chat Completions tool calls. Failed turns do not
change conversation history. Requests time out after 120 seconds, with at most five
model requests per question and no automatic retries. The map remains usable when
no model is configured or the server is unavailable.

“Solar potential” ranks the fixed June 21 measured roof exposure, excluding missing
values. Its units are unspecified; it is not energy production or engineering
suitability. Counts use geometric flat-roof area in m², not usable panel area.
Facade measurements are not available yet. Add future facade joins and tools in
`solar_queries.py`; the assistant and map consume generic building records keyed
by `building_id`, so they need no facade-specific conversation logic.
