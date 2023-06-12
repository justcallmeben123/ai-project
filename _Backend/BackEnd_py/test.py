from modules.database import llm_conversation
from modules.database import database_base
from flask_cors import CORS
from flask_restful import Api
from modules.llm_modules import llm_middleware
from flask import Flask

app = Flask(__name__)
CORS(app)
api = Api(app)



@app.route('/', methods=["GET"])
def index():
    v = llm_middleware.new_conversation('test_post', 'text')
    conv = llm_middleware.Conversation(v)
    conv.requests('text')
    conv.requests('text')
    conv.update_context()
    print(conv.to_json())
    i = conv.to_json()['id']

    # llm_middleware.get_conversation(i).update_context(conv.messages)
    # v.update_context(conv.messages)
    print(v.to_json())

    return (llm_middleware.get_conversation(i).to_json())

if __name__ == "__main__":
    database_base.init_db(app)
app.run(host='127.0.0.1', port=18010)