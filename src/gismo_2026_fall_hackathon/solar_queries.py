"""Read-only tools over the inventory already prepared for the shadow map."""
import math

METRICS = {
    'roof_area_m2': 'Geometric flat-roof area in m²; not usable panel area.',
    'roof_exposure': 'Fixed June 21 measured roof exposure; units unspecified; not electricity output.',
}


def _tool(name, description, properties, required):
    return {'type': 'function', 'function': {
        'name': name, 'description': description,
        'parameters': {'type': 'object', 'properties': properties,
                       'required': required, 'additionalProperties': False}}}


FILTERS = {
    'roof_area_above_m2': {'type': 'number', 'description': 'Strict lower roof-area threshold in square meters.'},
    'exposure_above': {'type': 'number', 'description': 'Strict lower measured exposure threshold; excludes missing data.'},
}
# Add facade tools here when their source data and metric definitions are available.
TOOLS = [
    _tool('count_buildings', 'Count buildings in the loaded scene, including its 1 km buffer. Optional thresholds combine with AND.', FILTERS, []),
    _tool('get_top_buildings', 'Rank roofs by area or measured June 21 exposure (the default meaning of solar potential). Missing values are excluded.', {
        'metric': {'type': 'string', 'enum': list(METRICS)},
        'limit': {'type': 'integer', 'minimum': 1, 'maximum': 20}, **FILTERS,
    }, ['metric', 'limit']),
    _tool('get_building_details', 'Get roof measurements by building ID in the loaded scene.', {
        'building_id': {'type': 'string'},
    }, ['building_id']),
]


def execute_tool(name: str, arguments: dict, inventory: dict, *, include_count_records: bool = False) -> dict:
    """Validate model arguments independently of the advertised JSON schema."""
    definition = next((tool['function'] for tool in TOOLS if tool['function']['name'] == name), None)
    if definition is None:
        raise ValueError(f'Unknown tool: {name}')
    schema = definition['parameters']
    if not isinstance(arguments, dict) or set(arguments) - set(schema['properties']) or set(schema['required']) - set(arguments):
        raise ValueError('Missing or unknown tool arguments.')
    for key in FILTERS.keys() & arguments.keys():
        value = arguments[key]
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError(f'{key} must be a finite nonnegative number.')
    rows = list(inventory.values())
    coverage = sum(row['roof_exposure'] is not None for row in rows)
    if name == 'get_building_details':
        building_id = arguments['building_id']
        if not isinstance(building_id, str) or building_id not in inventory:
            raise ValueError('Building ID not found in the loaded scene.')
        matches = [inventory[building_id]]
    else:
        matches = [row for row in rows if all(
            row[field] is not None and row[field] > arguments[key]
            for key, field in [('roof_area_above_m2', 'roof_area_m2'), ('exposure_above', 'roof_exposure')]
            if key in arguments)]
        if name == 'get_top_buildings':
            metric, limit = arguments['metric'], arguments['limit']
            if not isinstance(metric, str) or metric not in METRICS:
                raise ValueError('Unsupported ranking metric.')
            if type(limit) is not int or not 1 <= limit <= 20:
                raise ValueError('Limit must be an integer between 1 and 20.')
            matches = sorted((row for row in matches if row[metric] is not None),
                             key=lambda row: (-row[metric], row['building_id']))
    total = len(matches)
    records = (matches if include_count_records else []) if name == 'count_buildings' else matches[:arguments.get('limit', 1)]
    return {'tool': name, 'arguments': arguments, 'total_matches': total, 'records': records,
            'scene_buildings': len(rows), 'measured_roofs': coverage,
            'scope': 'Loaded scene, including the 1 km caster buffer.', 'metrics': METRICS}
