'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('user_fava', {
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
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_fava');
    }
};