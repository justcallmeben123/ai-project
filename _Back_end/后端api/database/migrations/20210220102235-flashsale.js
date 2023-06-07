'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('flashsale', {
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
            price: {
                type: DECIMAL(10, 2),
                defaultValue: 0,
                comment: '秒杀价格',
            },
            s_num: {
                type: INTEGER,
                defaultValue: 0,
                comment: '秒杀限额',
            },
            used_num: {
                type: INTEGER,
                defaultValue: 0,
                comment: '已参与人数',
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
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('flashsale');
    }
};