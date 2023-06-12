import openai
from modules.helper.config import config

openai.api_key = "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"
connect_gpt = config['debug']['use_gpt']

def request_gpt(prompt,messages,model = "gpt-3.5-turbo"):
    if connect_gpt == '0':
        return '宁王好帅,有好多妹妹'
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": prompt},
            #{"role": "user", "content": usertext}
        ]+messages
    )
    return response.choices[0].message.content


