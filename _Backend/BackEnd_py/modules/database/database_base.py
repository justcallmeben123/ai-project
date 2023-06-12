from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from modules.helper.config import config

user = config['sql.connect']['user']    #sql用户名
password = config['sql.connect']['password'] #sql密码
host = config['sql.connect']['host']    #sql host
port = config['sql.connect']['port']      #sql端口
database_name = config['sql.connect']['database_name'] #数据库名称


print('mysql://'+user+':'+password+'@'+host+':'+port+'/'+database_name)

engine = create_engine('mysql://'+user+':'+password+'@'+host+':'+port+'/'+database_name,
                       echo=True)
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
    persist_directory="vectorstore" # Optional, defaults to .chromadb/ in the current directory
))

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import modules.database.llm_conversation
    Base.metadata.create_all(bind=engine)