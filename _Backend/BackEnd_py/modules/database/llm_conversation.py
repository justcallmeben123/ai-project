import numpy as np
from sqlalchemy import Column, Integer, String,Text,JSON
from modules.database import database_base
from chromadb.utils import embedding_functions

emb_fn = embedding_functions.DefaultEmbeddingFunction()

class DObject_llm_conversation(database_base.Base):
    __tablename__ = 'test'
    id = Column(Integer, primary_key=True)
    collection_name = Column(String(50)) #course id
    first_question = Column(Text)
    conversation = Column(JSON)
    evaluation = Column(JSON)

    def __init__(self, collection_name, first_question, conversation=None):
        self.collection_name = collection_name
        self.first_question = first_question
        self.conversation = conversation
        self.evaluation = 0

        database_base.db_session.add(self)
        database_base.db_session.commit()

        collection = database_base.vectorstore_client.get_or_create_collection(name=collection_name,
                                                                               embedding_function=emb_fn)
        collection.add(
            documents=[first_question],
            metadatas=[{"id":self.id }],
            ids=[str(self.id)]
        )
        print(self.id)
        print(self.collection_name)

    def update(self,conversation):
        self.conversation = conversation

    def __repr__(self):
        return f'<conversation {self.first_question!r}>'

lookup_threshold = 1
def lookup(collection_name,first_question):
    collection = database_base.vectorstore_client.get_collection(name=collection_name)
    result = collection.query(query_texts=[first_question], n_results=3)
    ids = result['ids'][0]
    distances = result['distances'][0]
    conv = []
    for i in range(len(ids)):
        print(distances[i])
        if distances[i] < lookup_threshold:
            conv.append(DObject_llm_conversation.query.filter(DObject_llm_conversation.id == int(ids[i])).first())
    return conv

