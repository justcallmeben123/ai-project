import time

import jwt
import random
llm_access_token_limit = 10
llm_access_secrete_password_expire = 3

llm_access_secrete_password = "lidesheng@**_jz"

llm_access_secrete_key = "None"
llm_access_expire_time = llm_access_token_limit


def get_llm_access_token(password):
    #key = llm_access_secrete_password+str(int(time.time()))[:-llm_access_secrete_password_expire]
    #print(key)
    #try:
    #    payload = jwt.decode(password,key=key, algorithms='HS256')
    #except (jwt.ExpiredSignatureError,jwt.InvalidTokenError, jwt.InvalidSignatureError):
    if password != llm_access_secrete_password+str(int(time.time()))[:-llm_access_secrete_password_expire]:
        return None
    else:
        global llm_access_secrete_key
        global llm_access_expire_time

        llm_access_expire_time = llm_access_token_limit
        llm_access_secrete_key = str(random.random())

        encoded_jwt = jwt.encode({}, llm_access_secrete_key, algorithm="HS256")
        return encoded_jwt


def check_llm_access_token(token: str):

    try:
        payload = jwt.decode(token,key=llm_access_secrete_key, algorithms='HS256')
    except (jwt.ExpiredSignatureError,jwt.InvalidTokenError, jwt.InvalidSignatureError):
        return None
    else:
        global llm_access_expire_time
        llm_access_expire_time-=1
        if llm_access_expire_time == 0:
            return None
        else:
            return 0



