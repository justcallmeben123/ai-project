from modules.database import llm_conversation
from modules.database import database_base
from modules.llm_modules import llm_middleware
database_base.init_db()
v = llm_middleware.new_conversation('test_post', 'text')
conv = llm_middleware.Conversation(v)
conv.requests('text')
conv.requests('text')
conv.update_context()
print(conv.to_json())
i= conv.to_json()['id']

#llm_middleware.get_conversation(i).update_context(conv.messages)
#v.update_context(conv.messages)
print(v.to_json())

print(llm_middleware.get_conversation(i).to_json())
