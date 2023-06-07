'use strict';

const Service = require('./base');

class ColumnService extends Service {
    // 当前网校下的指定专栏是否存在
    async isExist(id, school_id = 0) {
        let { ctx, app } = this;
        if (school_id == 0) {
            school_id = ctx.currentSchool.id
        }
        const options = {
            where: {
                school_id,
                id
            }
        }
        return await this.findOrFail('Column', options, '专栏ID不存在')
    }

    // 获取专栏信息（id，封面，标题，价格，类型）
    async getGoodsInfo(id) {
        const { ctx } = this
        const school_id = ctx.currentSchool.id
        const options = {
            where: {
                id,
                school_id,
                status: 1
            },
            attributes: ["id", "title", "cover", "price"]
        }
        return await this.findOrFail('Column', options, '专栏ID不存在')
    }
}

module.exports = ColumnService;