from modules.llm_modules import openai_gpt
from modules.database import llm_conversation

memory_size = 1


class Conversation:
    def __init__(self, conversation):
        self.dObject_llm_conversation = conversation
        self.prompt = conversation.conversation_context['prompt']
        self.extra_source = conversation.conversation_context['extra_source']
        self.messages = conversation.conversation_context['messages']

    def requests(self, user_text, llm_api_call=openai_gpt.request_gpt):
        self.messages.append({"role": "user", "content": user_text})
        msg = self.messages[-memory_size:]
        pmt = self.prompt + self.extra_source
        response = llm_api_call(pmt, msg)
        self.messages.append({"role": "assistant", "content": response})

    def update(self):
        self.dObject_llm_conversation.update_context('messages', self.messages)

    def to_json(self):
        return self.dObject_llm_conversation.to_json()


def question_lookup(collection_name, first_question,k=3):
    return llm_conversation.question_lookup(collection_name, first_question,k)


def new_conversation(collection_name, first_question):
    conv = llm_conversation.llm_conversation_dObject(collection_name, first_question)
    return conv


def get_conversation(conv_id):
    return llm_conversation.id_lookup(conv_id)


def like(conv_id):
    return llm_conversation.id_lookup(conv_id).like()


def dislike(conv_id):
    return llm_conversation.id_lookup(conv_id).dislike()


def top_ask(collection_name, k=3):
    return llm_conversation.top_ask(collection_name, k)
