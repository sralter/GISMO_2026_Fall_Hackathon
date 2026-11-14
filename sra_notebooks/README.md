# CityGML learning notebooks

1. [Inspect the source data](01_inspect_citygml.ipynb): delivery-area map, XML structure,
   coordinate systems, sample metadata, and one building's labeled surface outlines.
2. [Parse buildings and surfaces](02_parse_citygml.ipynb): use the reusable streaming
   reader to extract building records, polygons, holes, metadata, and inspection issues.
3. [Build labeled triangle meshes](03_mesh_citygml.ipynb): triangulate roofs and walls,
   preserve holes and source labels, preview a filled building, and recover source coordinates.

Open a notebook in VS Code and select the repository's `.venv` Python environment.
Alternatively, run `uv run jupyter lab` from the repository root and select the project
Python environment. Run each notebook's cells from top to bottom.

The notebooks expect the local dataset in `data/DA_WISE_GML/`. Change `GML_FILE` and
`SAMPLE_SIZE` in the first code cell to explore another bounded sample. Coordinates
remain unchanged; vertical units and datum are not yet verified.

The Stage 2 reader lives in `gismo_2026_fall_hackathon.citygml`. It yields one top-level
building at a time, preserving nested parts. Keep iteration bounded for exploration;
collecting the entire city in a list would consume substantial memory. Its validation
issues describe unsupported or excluded geometry, not a complete geometry audit.

The Stage 3 mesher is `gismo_2026_fall_hackathon.meshes.buildings_to_mesh`.
It requires an explicit `z_scale` converting source Z into horizontal units; the
notebook's 1:1 scale is provisional. Its PyVista mesh retains source identity per
triangle and stores a reversible local origin and Z scale. Invalid/nonplanar polygons
are reported, without automatic repair. Optional VTP export preserves labels and
transform metadata. Physical measurements and outward normals are not yet verified.
