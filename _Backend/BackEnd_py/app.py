from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api
from flask_restful import Resource

from modules.llm_modules import llm_api
from modules.llm_modules import llm_access_token
from modules.helper import response_generator

app = Flask(__name__)
CORS(app)
api = Api(app)


@app.route('/', methods=["GET"])
def index():
    return "Welcome to API v1, try /hello."


class Hello(Resource):
    @staticmethod
    def get():
        return "[get] hello flask"

    @staticmethod
    def post():
        return "[post] hello flask"


llm_conversation = []

class LLM_Access_Checker(Resource):
    def get(self):
        password = request.headers.get("password")

        token = llm_access_token.get_llm_access_token(password)
        if token is None:
            return response_generator.fail("password 无效")

        return response_generator.ok({"token":token})

class LLM_Caller(Resource):
    def get(self):
        token = request.headers.get("token")
        data = request.args
        id = data.get("id")

        if llm_access_token.check_llm_access_token(token) is None:
            return response_generator.fail("Token 无效")
        if id>len(llm_conversation):
            return response_generator.fail("无对话")
        if id == 0 :
            id = len(llm_conversation)
        else:
            id = id-1

        return response_generator.ok({"id":id+1, "conversation":llm_conversation[id]})

    def post(self):
        token = request.headers.get("token")
        data = request.get_json()
        id = data.get("id")
        text = data.get("text")

        if llm_access_token.check_llm_access_token(token) is None:
            return response_generator.fail("Token 无效")
        if id>len(llm_conversation):
            return response_generator.fail("无对话")
        if id == 0 :
            id = len(llm_conversation)
            llm_conversation.append([])
        else:
            id = id-1
        llm_conversation[id].append(llm_api.llm_asking(text))

        return response_generator.ok({"id":id+1,"conversation":llm_conversation[id]})


api.add_resource(Hello, '/hello')
api.add_resource(LLM_Caller, '/accllm')
api.add_resource(LLM_Access_Checker, '/accllm/token')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8010)
