# SPASE shadows

Live GPU shadow renderer for the SPASE Streamlit app. Generated from Streamlit's
official `component-template`, `cookiecutter/v2`, using Pure Typescript, then adapted
to consume Python/PyDeck geometry and precomputed solar directions.

Installed automatically by `uv sync` as a local workspace dependency. The committed
`spase_shadows/frontend/build` assets require no Node.js installation at runtime.
Python metadata/asset discovery follows the official CCv2 template unchanged.

## Frontend development

Use Node.js 22.16 or newer:

```sh
cd spase_shadows/frontend
npm ci
npm run build
```

`npm run build` cleans previous assets, type-checks TypeScript, and creates the
bundled ES module and CSS. Commit both generated files; all libraries are local,
with exact deck.gl versions and a committed npm lockfile. `node_modules` is ignored.

## Python API

`render_shadows(scene_payload=..., scene_id=..., steps=..., slot=..., shadows=..., live=...,
camera=..., camera_command=..., key='shadow_map')` mounts the renderer. `scene_payload` is a base64-encoded gzip-compressed
PyDeck JSON dictionary with separate roof, wall, ground, and study-boundary layers
and a `buildingInfo` lookup. `scene_id` changes when source geometry changes.
`steps` contains timezone-labeled timestamps, sun elevation and ray direction.
A changing `camera_command` applies a preset; other updates preserve the camera.
The returned CCv2 result has `slot`, synchronized only on slider release, and
`loaded_scene_id`, an acknowledgment that suppresses repeat geometry transfers.
A new browser instance requests the payload again if the server retains an old
acknowledgment.

The browser keeps one Deck instance per mounted component and releases it on
unmount. The shadow texture remains allocated at night or with shadows hidden to
avoid deck.gl 9.1 stale bindings; direct sunlight is zero at night and shadow
opacity is zero when disabled. No reflected light or clouds are calculated.

## Acceptance scene

From the repository root:

```sh
uv run streamlit run components/spase-shadows/example.py
```

At winter noon a 100 m block casts shadows on a neighboring 20 m block's roof and
south façade, as well as ground. Drag the time slider to verify live updates;
turn shadows off and on to compare. Requires WebGL2.
