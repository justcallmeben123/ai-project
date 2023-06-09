from sqlalchemy import Column, Integer, String,Text,JSON
from modules.database import database_base

class llm_conversation_dObject(database_base.Base):
    __tablename__ = 'llm_conversation'
    id = Column(Integer, primary_key=True)
    collection_name = Column(String(50)) #course id
    first_question = Column(Text)
    conversation = Column(JSON)

    def __init__(self, collection_name=None, first_question=None, conversation=None):
        self.collection_name = collection_name
        self.first_question = first_question
        self.conversation = conversation

        database_base.db_session.add(self)
        database_base.db_session.commit()
        print(self.id)
        print(self.collection_name)

    def update(self,conversation):
        self.conversation = conversation

    def __repr__(self):
        return f'<conversation {self.first_question!r}>'

def llm_conversation_lookup(collection_name,first_question):

    return 1

