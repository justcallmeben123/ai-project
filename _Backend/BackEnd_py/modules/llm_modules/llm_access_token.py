import time

import jwt
import random

llm_access_token_limit = 10
llm_access_secrete_password_expire = 3

llm_access_secrete_password = "lidesheng@**_jz"

llm_access_secrete_key = None
secrete_key_expire_time = 86400 #每天
secrete_key_expire_timer = 0

def secrete_key_expire_check():
    global llm_access_secrete_key
    global secrete_key_expire_timer

    curtime = time.time()
    if secrete_key_expire_timer < curtime:
        llm_access_secrete_key = "ybb"+str(random.random())+"!@#juzhou"
        secrete_key_expire_timer = curtime + secrete_key_expire_time

token_expire_time = 600


def timer():
    return {'expire': time.time() + token_expire_time}


def get_llm_access_token(password):
    key = llm_access_secrete_password+str(int(time.time()))[:-llm_access_secrete_password_expire]
    print(key)
    # try:
    #    payload = jwt.decode(password,key=key, algorithms='HS256')
    # except (jwt.ExpiredSignatureError,jwt.InvalidTokenError, jwt.InvalidSignatureError):

    if password != key:
        return None
    else:
        secrete_key_expire_check()
        assert(llm_access_secrete_key is not None)
        encoded_jwt = jwt.encode(timer(), llm_access_secrete_key, algorithm="HS256")
        return encoded_jwt


def check_llm_access_token(token: str):
    try:
        payload = jwt.decode(token, key=llm_access_secrete_key, algorithms='HS256')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
        return None
    else:
        if payload['expire'] < time.time():
            return None
        else:
            return 0
