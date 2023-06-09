from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('mysql://juzizhou:juzizhou@localhost:3306/Juzizhou_Database', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

#向量数据库,chromadb 2GBRAM
import chromadb
from chromadb.config import Settings
vectorstore_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    #persist_directory="/path/to/persist/directory" # Optional, defaults to .chromadb/ in the current directory
))
vectorstore_client = chromadb.Client()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import modules.database.llm_conversation
    Base.metadata.create_all(bind=engine)