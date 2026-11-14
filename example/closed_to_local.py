# example
# convert our existing Responses API tool definitions
# into Chat Completions format

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