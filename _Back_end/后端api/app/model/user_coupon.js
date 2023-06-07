'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const UserCoupon = app.model.define('user_coupon', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        school_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '网校id',
            references: {
                model: 'school',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        coupon_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '优惠券id',
            references: {
                model: 'coupon',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '用户id',
            references: {
                model: 'user',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        used: {
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '使用状态：1已使用，0未使用',
        },
        created_time: DATE,
        updated_time: DATE,

    });

    UserCoupon.associate = function(models) {
        // 关联优惠券
        UserCoupon.belongsTo(app.model.Coupon)

        // 关联用户
        UserCoupon.belongsTo(app.model.User)
    }

    return UserCoupon;
};