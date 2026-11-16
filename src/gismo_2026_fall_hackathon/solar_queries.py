"""Read-only tools over the inventory already prepared for the shadow map."""
import math
import numpy as np

METRICS = {
    'roof_area_m2': 'Geometric flat-roof area in m²; not usable panel area.',
    'roof_exposure': 'Fixed June 21 measured roof exposure; units unspecified; not electricity output.',
    'annual_kwh_m2': 'Calculated annual clear-sky incoming solar resource in kWh/m²/year; default roof potential.',
    'irradiance_w_m2': 'Calculated roof-average clear-sky irradiance in W/m² at the selected map date/time.',
}
THRESHOLDS = {
    'roof_area_above_m2': 'roof_area_m2', 'exposure_above': 'roof_exposure',
    'annual_above_kwh_m2': 'annual_kwh_m2', 'irradiance_above_w_m2': 'irradiance_w_m2',
}
FILTERS: dict[str, dict] = {
    key: {'type': 'number', 'description': f'Strict lower threshold for {METRICS[field]} Missing values are excluded.'}
    for key, field in THRESHOLDS.items()
}
FILTERS.update({
    'top_percent': {'type': 'number', 'description': 'Keep the top X percent (0 < X <= 100). Includes ties at the percentile cutoff.'},
    'percentile_metric': {'type': 'string', 'enum': list(METRICS), 'description': 'Metric for top_percent; default annual_kwh_m2.'},
    'percentile_scope': {'type': 'string', 'enum': ['scene', 'filtered'],
                         'description': 'scene: rank all valid buildings, then intersect filters (default). filtered: rank only buildings passing the other filters.'},
})
OPTIONS = {
    'refine_previous': {'type': 'boolean', 'description': 'Use true for "of these" follow-ups. Retains previous filters (or a ranked result set), adding/replacing supplied filters. False starts a new query.'},
}


def _tool(name, description, properties, required):
    return {'type': 'function', 'function': {
        'name': name, 'description': description,
        'parameters': {'type': 'object', 'properties': properties,
                       'required': required, 'additionalProperties': False}}}


# Add facade tools here when their source data and metric definitions are available.
TOOLS = [
    _tool('count_buildings', 'Count buildings. All supplied conditions combine with AND. Supports area, selected-time irradiance, annual resource, percentiles, and follow-ups.', {**FILTERS, **OPTIONS}, []),
    _tool('get_top_buildings', 'Rank filtered buildings. Default solar potential means annual_kwh_m2; roof_exposure is the separate June 21 reference dataset.', {
        'metric': {'type': 'string', 'enum': list(METRICS)},
        'limit': {'type': 'integer', 'minimum': 1, 'maximum': 20}, **FILTERS, **OPTIONS,
    }, ['metric', 'limit']),
    _tool('get_building_details', 'Get available roof measurements by building ID in the loaded scene.', {
        'building_id': {'type': 'string'},
    }, ['building_id']),
]


def _finite(value):
    return value is not None and math.isfinite(value)


def attach_solar_metrics(inventory: dict, results: dict, timestamp: int | None) -> dict:
    """Join saved calculations by building ID and exact timestamp, without altering the map."""
    annual, daily = results.get('annual'), results.get('day')
    annual_values = {}
    if annual is not None:
        for row in annual.to_dict(orient='records'):
            value = row['annual_kwh_m2']
            if row.get('status', 'ok') == 'ok' and _finite(value):
                annual_values[str(int(row['doitt_id']))] = float(value)
    instant_values = {}
    if daily is not None and timestamp is not None:
        slots = np.flatnonzero(daily['timestamps'] == timestamp)
        if len(slots) == 1:
            for building_id, valid, value in zip(daily['ids'], daily['valid'], daily['irradiance'][slots[0]]):
                if valid and _finite(value):
                    instant_values[str(int(building_id))] = float(value)
    return {key: {**row, 'annual_kwh_m2': annual_values.get(key),
                  'irradiance_w_m2': instant_values.get(key)} for key, row in inventory.items()}


def execute_tool(name: str, arguments: dict, inventory: dict, *, include_count_records: bool = False,
                 previous_query: dict | None = None, context: dict | None = None,
                 base_building_ids: list[str] | None = None) -> dict:
    """Validate arguments, resolve follow-ups, and calculate intersections in Python."""
    definition = next((tool['function'] for tool in TOOLS if tool['function']['name'] == name), None)
    if definition is None:
        raise ValueError(f'Unknown tool: {name}')
    schema = definition['parameters']
    if not isinstance(arguments, dict) or set(arguments) - set(schema['properties']) or set(schema['required']) - set(arguments):
        raise ValueError('Missing or unknown tool arguments.')
    for key in OPTIONS.keys() & arguments.keys():
        if type(arguments[key]) is not bool:
            raise ValueError(f'{key} must be a boolean.')
    filters: dict = {}
    if arguments.get('refine_previous'):
        if previous_query is None:
            raise ValueError('No previous building query to refine. State the full filters.')
        filters = dict(previous_query.get('applied_filters', {}))
        uses_time = 'irradiance_above_w_m2' in filters or filters.get('percentile_metric') == 'irradiance_w_m2' or previous_query['arguments'].get('metric') == 'irradiance_w_m2'
        if uses_time and previous_query.get('context', {}).get('timestamp') != (context or {}).get('timestamp'):
            raise ValueError('The selected map time changed since the previous irradiance query. State a new full query for the current time.')
        if previous_query['tool'] in ('get_top_buildings', 'get_building_details'):
            base_building_ids = [row['building_id'] for row in previous_query['records']]
        else:
            base_building_ids = previous_query.get('base_building_ids')
    filters.update({key: value for key, value in arguments.items() if key in FILTERS})
    for key in THRESHOLDS.keys() & filters.keys():
        value = filters[key]
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
            raise ValueError(f'{key} must be a finite nonnegative number.')
    if 'top_percent' in filters:
        value = filters['top_percent']
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not 0 < value <= 100:
            raise ValueError('top_percent must be greater than 0 and at most 100.')
        filters.setdefault('percentile_metric', 'annual_kwh_m2')
        filters.setdefault('percentile_scope', 'scene')
        if not isinstance(filters['percentile_metric'], str) or filters['percentile_metric'] not in METRICS or filters['percentile_scope'] not in ('scene', 'filtered'):
            raise ValueError('Unsupported percentile metric or population.')
    elif 'percentile_metric' in filters or 'percentile_scope' in filters:
        raise ValueError('Specify top_percent with percentile options.')
    metric = arguments.get('metric')
    if name == 'get_top_buildings':
        if not isinstance(metric, str) or metric not in METRICS:
            raise ValueError('Unsupported ranking metric.')
        if type(arguments['limit']) is not int or not 1 <= arguments['limit'] <= 20:
            raise ValueError('Limit must be an integer between 1 and 20.')
    rows = list(inventory.values())
    coverage = {field: sum(_finite(row.get(field)) for row in rows) for field in METRICS}
    required_metrics = {THRESHOLDS[key] for key in filters if key in THRESHOLDS}
    if metric:
        required_metrics.add(metric)
    if 'top_percent' in filters:
        required_metrics.add(filters['percentile_metric'])
    for field in required_metrics & {'annual_kwh_m2', 'irradiance_w_m2'}:
        if not coverage[field]:
            raise ValueError(f'No valid {METRICS[field]} data in this scene. Prepare the relevant solar results using the map controls; do not substitute June 21 exposure.')
    base_ids = set(base_building_ids) if base_building_ids is not None else None
    base = rows if base_ids is None else [row for row in rows if row['building_id'] in base_ids]
    conditions = {key: {row['building_id'] for row in base if _finite(row.get(field)) and row[field] > filters[key]}
                  for key, field in THRESHOLDS.items() if key in filters}
    matched_ids = {row['building_id'] for row in base}
    for ids in conditions.values():
        matched_ids &= ids
    percentile = None
    if 'top_percent' in filters:
        field = filters['percentile_metric']
        population = rows if filters['percentile_scope'] == 'scene' else [row for row in base if row['building_id'] in matched_ids]
        values = [row[field] for row in population if _finite(row.get(field))]
        cutoff = float(np.quantile(values, 1 - filters['top_percent'] / 100)) if values else None
        top_ids = {row['building_id'] for row in population if _finite(row.get(field)) and cutoff is not None and row[field] >= cutoff}
        conditions['top_percent'] = top_ids
        matched_ids &= top_ids
        percentile = {'percent': filters['top_percent'], 'metric': field, 'scope': filters['percentile_scope'],
                      'valid_population': len(values), 'cutoff': cutoff, 'ties': 'Included at the cutoff; the group can exceed the requested percentage.'}
    matches = [row for row in base if row['building_id'] in matched_ids]
    if name == 'get_building_details':
        building_id = arguments['building_id']
        if not isinstance(building_id, str) or building_id not in inventory:
            raise ValueError('Building ID not found in the loaded scene.')
        matches = [inventory[building_id]]
    elif name == 'get_top_buildings':
        matches = sorted((row for row in matches if _finite(row.get(metric))),
                         key=lambda row: (-row[metric], row['building_id']))
    total = len(matches)
    records = (matches if include_count_records else []) if name == 'count_buildings' else matches[:arguments.get('limit', 1)]
    effective_arguments = {**{key: value for key, value in arguments.items() if key not in FILTERS and key != 'refine_previous'}, **filters}
    result = {'tool': name, 'arguments': effective_arguments, 'applied_filters': filters,
              'total_matches': total, 'records': records, 'scene_buildings': len(rows),
              'measured_roofs': coverage['roof_exposure'], 'coverage': coverage,
              'scope': 'Loaded scene, including the 1 km caster buffer.', 'metrics': METRICS,
              'context': context or {}}
    if base_building_ids is not None:
        result['base_building_ids'] = base_building_ids
    if percentile:
        result['percentile'] = percentile
    result['condition_counts'] = {key: len(ids) for key, ids in conditions.items()}
    result['combined_count'] = total
    return result
