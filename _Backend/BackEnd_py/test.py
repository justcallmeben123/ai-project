from modules.database import llm_conversation
from modules.database import database_base
database_base.init_db()
#v = llm_conversation.DObject_llm_conversation("test", "1234")
#v = llm_conversation.DObject_llm_conversation("test", "12345")
#v = llm_conversation.DObject_llm_conversation("test", "00000")

#collection = database_base.vectorstore_client.get_or_create_collection(name="test")
#print(collection.query(query_texts=['1234'],n_results =3))
print(llm_conversation.top_ask("test"))
print(llm_conversation.top_ask("test"))