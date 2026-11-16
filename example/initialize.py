from openai import OpenAI
from spase.config import BASE_URL, API_KEY, MODEL

client = OpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
)