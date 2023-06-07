'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
class CommonService extends Service {
    async upload() {
        const { ctx, app } = this;
        const currentUser = ctx.authUser;

        if (!ctx.request.files) {
            ctx.throw(400, '请先选择上传文件')
        }

        const file = ctx.request.files[0];
        const name = 'egg-edu-demo/' + ctx.genID() + path.extname(file.filename);

        let result;
        try {
            result = await ctx.oss.put(name, file.filepath);
        } catch (err) {
            ctx.throw(400, err.name);
        }

        if (result) {
            return result.url
        }

        ctx.throw(400, '上传失败')
    }
}

module.exports = CommonService;