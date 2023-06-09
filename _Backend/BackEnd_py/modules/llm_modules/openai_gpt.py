from modules.llm_modules import llm
import openai
openai.api_key = "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"


def request_gpt(prompt,messages,model = "gpt-3.5-turbo"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": prompt},
            #{"role": "user", "content": usertext}
        ]+messages
    )
    return response.choices[0].message.content


