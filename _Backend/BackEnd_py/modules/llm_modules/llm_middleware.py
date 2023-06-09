from modules.llm_modules import openai_gpt


def llm_asking(text):
    response = openai_gpt.request_gpt(usertext=text)
    response_text = response.choices[0].message.content
    return response_text