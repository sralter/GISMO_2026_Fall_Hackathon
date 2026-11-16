
import json

from openai import OpenAI

from spase.tools import TOOLS, dispatch_tool


MODEL = "your-loaded-model-id"

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio",
)


INSTRUCTIONS = """
You are SPASE Intelligence.

You help users identify buildings with suitable surfaces
for photovoltaic installation in New York City.

You have access to tools that query our processed
geospatial building inventory.

Rules:
- Use tools for building rankings and numerical results.
- Never invent building IDs or irradiation values.
- Distinguish rooftop and vertical facade potential.
- Explain results clearly.
- Treat suitability scores as screening estimates.
"""


# convert the tool definitions from the previous example
CHAT_TOOLS = [
    {
        "type": "function",
        "function": {
            key: value
            for key, value in tool.items()
            if key != "type"
        },
    }
    for tool in TOOLS
]


def answer_question(
    question: str,
    conversation: list[dict],
) -> tuple[str, list[dict]]:

    # add the new question to conversation history
    conversation.append({
        "role": "user",
        "content": question,
    })

    for _ in range(5):

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": INSTRUCTIONS,
                },
                *conversation,
            ],
            tools=CHAT_TOOLS,
            tool_choice="auto",
            temperature=0.2,
        )

        message = response.choices[0].message

        # preserve the assistant's tool-call message
        conversation.append(
            message.model_dump(exclude_none=True)
        )

        # if no tool calls, we have our final answer
        if not message.tool_calls:
            return message.content or "", conversation

        # execute requested Python functions
        for tool_call in message.tool_calls:

            name = tool_call.function.name

            arguments = json.loads(
                tool_call.function.arguments
            )

            try:
                result = dispatch_tool(name, arguments)

            except Exception as error:
                result = json.dumps({
                    "error": str(error),
                })

            conversation.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result,
            })

    return (
        "I reached the maximum number of tool calls.",
        conversation,
    )
