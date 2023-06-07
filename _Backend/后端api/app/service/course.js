'use strict';

const Service = require('./base');

class CourseService extends Service {
    // 当前网校下的指定课程是否存在
    async isExist(id, school_id = 0) {
        let { ctx } = this;
        if (school_id == 0) {
            school_id = ctx.currentSchool.id
        }
        const options = {
            where: {
                school_id,
                id
            }
        }
        return await this.findOrFail('Course', options, '课程ID不存在')
    }

    // 获取课程信息（id，封面，标题，价格，类型）
    async getGoodsInfo(id) {
        const { ctx } = this
        const school_id = ctx.currentSchool.id
        const options = {
            where: {
                id,
                school_id,
                status: 1
            },
            attributes: ["id", "title", "cover", "price", "type"]
        }
        return await this.findOrFail('Course', options, '课程ID不存在')
    }
}

module.exports = CourseService;