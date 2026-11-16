
import json

from spase.queries import (
    get_top_buildings,
    get_building_details,
)


# describe the tools available to the model
TOOLS = [
    {
        "type": "function",
        "name": "get_top_buildings",
        "description": (
            "Find the highest-ranking buildings for solar "
            "PV installation. Supports rooftop and vertical "
            "facade surfaces, including facade orientation."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "surface_type": {
                    "type": "string",
                    "enum": ["horizontal", "vertical"],
                    "description": "Surface type to evaluate.",
                },
                "orientation": {
                    "type": ["string", "null"],
                    "enum": [
                        "north",
                        "south",
                        "east",
                        "west",
                        None,
                    ],
                    "description": (
                        "Optional facade orientation. "
                        "Use null for all orientations."
                    ),
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of buildings to return.",
                },
            },
            "required": [
                "surface_type",
                "orientation",
                "limit",
            ],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "get_building_details",
        "description": (
            "Retrieve solar suitability metrics for an "
            "individual building using its building ID."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "building_id": {
                    "type": "string",
                    "description": "Unique building identifier.",
                },
            },
            "required": ["building_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]


# execute only explicitly approved functions
def execute_tool(name: str, arguments: dict) -> dict:

    if name == "get_top_buildings":
        limit = arguments["limit"]

        if not 1 <= limit <= 20:
            raise ValueError("Limit must be between 1 and 20.")

        result = get_top_buildings(
            surface_type=arguments["surface_type"],
            orientation=arguments["orientation"],
            limit=limit,
        )

    elif name == "get_building_details":
        result = get_building_details(
            building_id=arguments["building_id"]
        )

    else:
        raise ValueError(f"Unknown tool: {name}")

    # convert pandas/geospatial results into JSON-compatible data
    if hasattr(result, "to_dict"):
        result = result.to_dict(orient="records")

    return result


def dispatch_tool(name: str, arguments: dict) -> str:
    result = execute_tool(name, arguments)

    return json.dumps(
        result,
        default=str,
        allow_nan=False,
    )
