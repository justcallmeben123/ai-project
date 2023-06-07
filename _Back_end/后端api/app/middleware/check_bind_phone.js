module.exports = (option, app) => {
    return async(ctx, next) => {

        if (!ctx.authUser.phone) {
            ctx.throw(400, '请先绑定手机号');
        }

        await next();
    }
}