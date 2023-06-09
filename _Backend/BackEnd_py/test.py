from modules.database import llm_conversation
from modules.database import database_base
database_base.init_db()
v = llm_conversation.llm_conversation_dObject(1,1,1)

print(v.id)