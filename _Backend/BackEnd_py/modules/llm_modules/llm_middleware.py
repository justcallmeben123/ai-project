from modules.llm_modules import openai_gpt
from modules.database import llm_conversation
import json

memory_size = 1


class Conversation:
    def __init__(self, conversation):
        self.conv_id = conversation.id
        self.prompt = conversation.prompt_setting['prompt']
        self.extra_source = conversation.prompt_setting['extra_source']
        self.messages = conversation.load_context()

    def requests(self, user_text, llm_api_call=openai_gpt.request_gpt):
        self.messages.append({"role": "user", "content": user_text})
        msg = self.messages[-memory_size:]
        pmt = self.prompt + self.extra_source
        response = llm_api_call(pmt, msg)
        self.messages.append({"role": "assistant", "content": response})

    def update_context(self):
        get_conversation(self.conv_id).update_context(self.messages)

    def to_json(self):
        return get_conversation(self.conv_id).to_json()


def question_lookup(collection_name, first_question,k=3):
    return llm_conversation.question_lookup(collection_name, first_question,k)


def new_conversation(collection_name, first_question):
    conv = llm_conversation.DObject_llm_conversation(collection_name, first_question)
    return conv


def get_conversation(conv_id):
    return llm_conversation.id_lookup(conv_id)


def like(conv_id):
    return llm_conversation.id_lookup(conv_id).like()


def dislike(conv_id):
    return llm_conversation.id_lookup(conv_id).dislike()


def top_ask(collection_name, k=3):
    return llm_conversation.top_ask(collection_name, k)
