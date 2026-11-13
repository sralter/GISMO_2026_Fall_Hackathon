Start with [the guided CityGML inspection notebook](notebooks/01_inspect_citygml.ipynb).
It maps the delivery areas, inspects a bounded building sample, explains coordinates,
and plots one building's labeled surface boundaries.

Open it in VS Code and select the repository's `.venv` Python environment, or run
`uv run jupyter lab` from this directory. The notebook expects the local dataset in
`data/DA_WISE_GML/`; change `GML_FILE` and `SAMPLE_SIZE` in its first code cell to
explore another sample.
