module.exports = (option, app) => {
    return async(ctx, next) => {
        //1. 获取 header 头token
        const { token } = ctx.header;

        if (!token) {
            return await next();
        }
        //2. 根据token解密，换取用户信息
        let user = {};
        try {
            user = app.checkToken(token);
            if (user) {
                let currentUser = await app.model.User.findByPk(user.id);
                if (currentUser) {
                    // 5. 把 user 信息挂载到全局ctx上
                    ctx.authUser = currentUser;
                }
            }
        } catch (error) {}

        await next();
    }
}