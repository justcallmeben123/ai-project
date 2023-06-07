
import openai
openai.api_key = "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"


def request_gpt(prompt="你是一只猫娘",usertext="",model = "gpt-3.5-turbo"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": usertext}
        ]
    )
    return response


