'use strict';

const Service = require('./base');

class BookService extends Service {
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
        return await this.findOrFail('Book', options, '电子书ID不存在')
    }

    // 获取电子书信息（id，封面，标题，价格，类型）
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
        return await this.findOrFail('Book', options, '电子书ID不存在')
    }
}

module.exports = BookService;