
from flask_sqlalchemy import SQLAlchemy
from modules.helper.config import config

user = config['sql.connect']['user']    #sql用户名
password = config['sql.connect']['password'] #sql密码
host = config['sql.connect']['host']    #sql host
port = config['sql.connect']['port']      #sql端口
database_name = config['sql.connect']['database_name'] #数据库名称


db_uri = 'mysql://'+user+':'+password+'@'+host+':'+port+'/'+database_name
if config['sql.connect']['not_use_mySQL'] == '0':
    db_uri = "sqlite:///project.db"
db = SQLAlchemy()


#向量数据库,chromadb 2GBRAM
import chromadb
from chromadb.config import Settings
vectorstore_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="vectorstore" # Optional, defaults to .chromadb/ in the current directory
))

def init_db(app):
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import modules.database.llm_conversation

    # configure the SQLite database, relative to the app instance folder
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
    # initialize the app with the extension
    db.init_app(app)
    with app.app_context():
        db.create_all()