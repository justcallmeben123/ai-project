from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api
from flask_restful import Resource

from modules.llm_modules import llm_middleware, llm_access_token
from modules.helper import response_generator

from modules.database import llm_conversation, database_base

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


class LLM_Access_Handler(Resource):
    def get(self, call_type):
        #get token
        if call_type == 'token':
            password = request.headers.get("password")

            token = llm_access_token.get_llm_access_token(password)
            if token is None:
                return response_generator.fail("password 无效")

            return response_generator.ok({"token": token})


        token = request.headers.get("token")
        if llm_access_token.check_llm_access_token(token) is None:
            return response_generator.fail("Token 无效", code=-1)

        if call_type == 'conversation':
            data = request.args
            conv_id = data.get("id")

            result = llm_middleware.get_conversation(conv_id)
            if result is None:
                return response_generator.fail("无对话", code=-2)

            return response_generator.ok(result.to_json())

        return response_generator.fail("unknown call type", code=-10)


    def post(self, call_type):
        token = request.headers.get("token")
        if llm_access_token.check_llm_access_token(token) is None:
            return response_generator.fail("Token 无效", code=-1)

        data = request.get_json()
        if call_type == 'new':
            text = data.get("text")
            collection_name = data.get("collection_name")
            conv = llm_middleware.Conversation(llm_middleware.new_conversation(collection_name, text))
            conv.requests(text)
            conv.update_context()
            return response_generator.ok(conv.to_json())
        elif call_type == 'top_ask':
            collection_name = data.get("collection_name")
            top_asks = [x.to_json() for x in llm_middleware.top_ask(collection_name)]
            return response_generator.ok(top_asks)
        elif call_type == 'top_close':
            text = data.get("text")
            collection_name = data.get("collection_name")
            top_closes = [x.to_json() for x in llm_middleware.question_lookup(collection_name,text)]
            for c in top_closes: c.add_frequency()
            return response_generator.ok(top_closes)
        elif call_type == 'like':
            conv_id = data.get("id")
            return response_generator.ok(llm_middleware.like(conv_id))
        elif call_type == 'dislike':
            conv_id = data.get("id")
            return response_generator.ok(llm_middleware.dislike(conv_id))


        return response_generator.fail("unknown call type", code=-10)



api.add_resource(Hello, '/hello')
api.add_resource(LLM_Access_Handler, '/accllm/<string:call_type>')


if __name__ == "__main__":
    database_base.init_db()

    app.run(host='127.0.0.1', port=8010)
