'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('order_item', {
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
            comment: {
                type: TEXT,
                allowNull: true,
                comment: '课程评价'
            },
            comment_time: DATE,
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('order_item');
    }
};