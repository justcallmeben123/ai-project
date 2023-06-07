'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const OrderItem = app.model.define('order_item', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        goods_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '课程/专栏id'
        },
        type: {
            type: STRING,
            allowNull: false,
            defaultValue: 'course',
            comment: '类型：course课程，column专栏'
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
        order_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '所属订单id',
            references: {
                model: 'order',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '用户id'
        },
        comment: {
            type: TEXT,
            allowNull: true,
            comment: '课程评价'
        },
        comment_time: DATE,
        created_time: DATE,
        updated_time: DATE,
    });

    OrderItem.associate = function(models) {
        // 关联课程
        OrderItem.belongsTo(app.model.Course, {
            foreignKey: 'goods_id'
        })

        // 关联专栏
        OrderItem.belongsTo(app.model.Column, {
            foreignKey: 'goods_id'
        })

        // 关联电子书
        OrderItem.belongsTo(app.model.Book, {
            foreignKey: 'goods_id'
        })
        
        // 关联直播
        OrderItem.belongsTo(app.model.Live, {
            foreignKey: 'goods_id'
        })

        // 关联订单
        OrderItem.belongsTo(app.model.Order)
    }

    return OrderItem;
};