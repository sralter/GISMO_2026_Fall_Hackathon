# CityGML learning notebooks

1. [Inspect the source data](01_inspect_citygml.ipynb): delivery-area map, XML structure,
   coordinate systems, sample metadata, and one building's labeled surface outlines.
2. [Parse buildings and surfaces](02_parse_citygml.ipynb): use the reusable streaming
   reader to extract building records, polygons, holes, metadata, and inspection issues.

Open a notebook in VS Code and select the repository's `.venv` Python environment.
Alternatively, run `uv run jupyter lab` from the repository root and select the project
Python environment. Run each notebook's cells from top to bottom.

Both notebooks expect the local dataset in `data/DA_WISE_GML/`. Change `GML_FILE` and
`SAMPLE_SIZE` in the first code cell to explore another bounded sample. Coordinates
remain unchanged; vertical units and datum are not yet verified.

The Stage 2 reader lives in `gismo_2026_fall_hackathon.citygml`. It yields one top-level
building at a time, preserving nested parts. Keep iteration bounded for exploration;
collecting the entire city in a list would consume substantial memory. Its validation
issues describe unsupported or excluded geometry, not a complete geometry audit.
