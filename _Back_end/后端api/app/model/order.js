'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Order = app.model.define('order', {
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
        no: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '订单id',
        },
        status: {
            type: STRING(10),
            allowNull: false,
            defaultValue: '',
            comment: '支付状态：pendding等待支付，success支付成功，fail支付失败',
        },
        price: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '实付价格',
        },
        total_price: {
            type: DECIMAL,
            defaultValue: 0,
            comment: '总价格',
        },
        type: {
            type: STRING,
            defaultValue: 'default',
            comment: '类型',
        },
        pay_method: {
            type: STRING,
            comment: '支付方式',
        },
        pay_time: {
            type: DATE,
            comment: '支付时间',
        },
        user_coupon_id: {
            type: INTEGER,
            allowNull: true,
            comment: '用户优惠券id'
        },
        flashsale_id: {
            type: INTEGER,
            allowNull: true,
            comment: '秒杀id'
        },
        group_work_id: {
            type: INTEGER,
            allowNull: true,
            comment: '组团id'
        },
        wxpay_code_url: {
            type: STRING,
            comment: '微信pc支付二维码',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Order.associate = function(models) {
        // 关联子订单
        Order.hasMany(app.model.OrderItem);

        // 关联组团
        Order.belongsTo(app.model.GroupWork);

        // 关联用户
        Order.belongsTo(app.model.User);
    }

    return Order;
};