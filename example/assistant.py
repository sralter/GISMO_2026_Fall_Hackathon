
import json

from openai import OpenAI

from spase.tools import TOOLS, dispatch_tool


MODEL = "gpt-6-astra"

INSTRUCTIONS = """
You are SPASE Intelligence, a geospatial solar assessment assistant.

You help users identify buildings with suitable surfaces
for photovoltaic installation in New York City.

You have access to tools that query our processed building
inventory.

Rules:
1. Use the available tools to answer questions about buildings.
2. Never invent building IDs, irradiation values, or rankings.
3. Do not claim that a building is suitable without supporting
   data from the tools.
4. Explain the results in clear, accessible language.
5. Distinguish between horizontal rooftop and vertical facade
   potential.
6. Explain that suitability scores are screening estimates,
   not engineering or financial assessments.
7. If a question cannot be answered using available tools,
   say so rather than inventing an answer.
"""


def answer_question(
    client: OpenAI,
    question: str,
    previous_response_id: str | None = None,
) -> tuple[str, str]:

    # initial request to the model
    request = {
        "model": MODEL,
        "instructions": INSTRUCTIONS,
        "input": question,
        "tools": TOOLS,
    }

    if previous_response_id:
        request["previous_response_id"] = previous_response_id

    response = client.responses.create(**request)

    # allow the model to request tools
    for _ in range(5):

        function_calls = [
            item
            for item in response.output
            if item.type == "function_call"
        ]

        # no more tools needed: return the final answer
        if not function_calls:
            return response.output_text, response.id

        tool_outputs = []

        for call in function_calls:

            arguments = json.loads(call.arguments)

            try:
                result = dispatch_tool(
                    call.name,
                    arguments,
                )

            except Exception as error:
                result = json.dumps({
                    "error": str(error),
                })

            tool_outputs.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": result,
            })

        # send tool results back to the model
        response = client.responses.create(
            model=MODEL,
            instructions=INSTRUCTIONS,
            previous_response_id=response.id,
            input=tool_outputs,
            tools=TOOLS,
        )

    return (
        "I reached the maximum number of tool calls. "
        "Please try a simpler question.",
        response.id,
    )
