

def fail(data = "",msg = "fail", code = 0):
    return {"msg": msg,"data": data,"code": code}


def ok(data = "",msg = "ok", code = 20000):
    return {"msg": msg,"data": data,"code": code}
