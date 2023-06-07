'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Coupon = app.model.define('coupon', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        school_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '所属网校id',
            references: {
                model: 'school',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        type: {
            type: STRING,
            allowNull: false,
            defaultValue: 'course',
            comment: '类型：course课程，column专栏'
        },
        goods_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '关联课程/专栏id',
        },
        condition: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '使用条件',
        },
        price: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '优惠券价格',
        },
        c_num: {
            type: INTEGER,
            defaultValue: 0,
            comment: '发行量',
        },
        received_num: {
            type: INTEGER,
            defaultValue: 0,
            comment: '已领取',
        },
        used_num: {
            type: INTEGER,
            defaultValue: 0,
            comment: '已使用',
        },
        status: {
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '状态'
        },
        start_time: DATE,
        end_time: DATE,
        created_time: DATE,
        updated_time: DATE,
    });

    Coupon.associate = function(models) {
        // 关联课程
        Coupon.belongsTo(app.model.Course, {
            foreignKey: 'goods_id'
        })

        // 关联专栏
        Coupon.belongsTo(app.model.Column, {
            foreignKey: 'goods_id'
        })

        // 关联用户领取的优惠券
        Coupon.hasMany(app.model.UserCoupon)
    }


    return Coupon;
};