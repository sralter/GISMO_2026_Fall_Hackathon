import os

LLM_PROVIDER = os.getenv(
    "LLM_PROVIDER",
    "local",
)

if LLM_PROVIDER == "local":

    BASE_URL = "http://localhost:1234/v1"
    API_KEY = "lm-studio"

    MODEL = os.getenv(
        "LOCAL_MODEL",
        "your-loaded-model-id",
    )

elif LLM_PROVIDER == "openai":

    BASE_URL = "https://api.openai.com/v1"
    API_KEY = os.environ["OPENAI_API_KEY"]

    MODEL = os.getenv(
        "OPENAI_MODEL",
        "your-available-api-model",
    )

else:
    raise ValueError("Unknown LLM provider")