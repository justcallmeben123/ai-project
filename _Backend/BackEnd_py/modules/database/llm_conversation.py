from sqlalchemy import Column, Integer, String,Text,JSON
from modules.database.base import Database_Base

class llm_conversation_dObject(Database_Base):
    __tablename__ = 'llm_conversation'
    id = Column(Integer, primary_key=True)
    collection_name = Column(String(50)) #course id
    first_question = Column(Text, unique=True)
    conversation = Column(JSON)

    def __init__(self, collection_name=None, first_question=None, conversation=None):
        self.collection_name = collection_name
        self.first_question = first_question
        self.conversation = conversation

        print(self.id)

    def update(self,conversation):
        self.conversation = conversation

    def __repr__(self):
        return f'<conversation {self.first_question!r}>'

def llm_conversation_lookup(collection_name,first_question):
    return 1

