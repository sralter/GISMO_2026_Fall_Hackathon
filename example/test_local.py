
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio",
)

# inspect models currently available through LM Studio
models = client.models.list()

for model in models.data:
    print(model.id)

# select a loaded model
model_id = models.data[0].id

response = client.chat.completions.create(
    model=model_id,
    messages=[
        {
            "role": "user",
            "content": "Explain solar irradiation in one paragraph.",
        }
    ],
)

print(response.choices[0].message.content)
