import numpy as np
from sqlalchemy import Column, Integer, String,Text,JSON
from modules.database import database_base
from chromadb.utils import embedding_functions

emb_fn = embedding_functions.DefaultEmbeddingFunction()

class DObject_llm_conversation(database_base.Base):
    __tablename__ = 'test__'
    id = Column(Integer, primary_key=True)
    collection_name = Column(String(50)) #course id
    first_question = Column(Text)
    conversation_context = Column(JSON)
    evaluation = Column(Integer)
    frequency = Column(Integer)

    def __init__(self, collection_name, first_question, conversation_context=None):
        self.collection_name = collection_name
        self.first_question = first_question
        self.conversation_context = conversation_context
        self.evaluation = 0
        self.frequency = 1

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

    def update_context(self,key,value):
        self.conversation_context = conversation_context
        database_base.db_session.commit()

    def like(self):
        self.evaluation += 1
        database_base.db_session.commit()
        return self.evaluation

    def dislike(self):
        self.evaluation -= 1
        if self.evaluation <0:
            collection = database_base.vectorstore_client.get_collection(name=self.collection_name)
            collection.delete(ids=[str(self.id)])
        database_base.db_session.commit()
        return self.evaluation

    def add_frequency(self):
        self.frequency+=1
        database_base.db_session.commit()
        return self.frequency

    def __repr__(self):
        return f'<conversation {self.first_question!r}>'

    def to_json(self):
        return {
            'id': self.id,
            'collection_name': self.collection_name,
            'first_question': self.first_question,
            'conversation_context': self.conversation,
            'evaluation': self.evaluation
        }

question_lookup_threshold = 1
def question_lookup(collection_name,first_question,k = 3):
    collection = database_base.vectorstore_client.get_collection(name=collection_name)
    result = collection.query(query_texts=[first_question], n_results=k)
    ids = result['ids'][0]
    distances = result['distances'][0]
    conv = []
    for i in range(len(ids)):
        print(distances[i])
        if distances[i] < question_lookup_threshold:
            conv.append(DObject_llm_conversation.query.get(int(ids[i])))
    return conv


def id_lookup(conv_id):
    return DObject_llm_conversation.query.get(int(conv_id))


def top_ask(collection_name,k=3):
    return DObject_llm_conversation.query.filter(DObject_llm_conversation.evaluation >= 0).order_by('frequency')[:k]

