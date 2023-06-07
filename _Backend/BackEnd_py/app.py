from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api
from flask_restful import Resource

from modules.llm_modules import llm_api

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


user_response_dict = dict()

class LLM_Caller(Resource):
    def get(self,userid):
        if userid not in user_response_dict:
            return None
        return user_response_dict[userid][-1]

    def put(self,userid):
        question = request.form['question']
        if userid not in user_response_dict:
            user_response_dict[userid] = []
        user_response_dict[userid].append(llm_api.llm_asking(question))
        return user_response_dict[userid][-1]


api.add_resource(Hello, '/hello')


api.add_resource(LLM_Caller, '/LLM_Caller/<string:userid>')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8010)
