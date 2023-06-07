module.exports = (option, app) => {
    return async(ctx, next) => {
        const { appid } = ctx.header;
        if (!appid) {
            ctx.throw(400, '非法参数appid!');
        }

        let s = await app.model.School.findOne({
            where: {
                appid: appid,
            }
        })

        if (!s) {
            ctx.throw(400, '当前网校不存在!');
        }

        if (!s.status) {
            ctx.throw(400, '当前网校已被封禁!');
        }

        // if(!s.level_id){
        //     ctx.throw(400, '当前网校没有授权，请先购买授权');
        // }
        ctx.currentSchool = s

        await next();
    }
}