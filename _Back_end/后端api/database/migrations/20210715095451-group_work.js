'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('group_work', {
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
            num: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 1,
                comment: '当前拼团人数'
            },
            total: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 2,
                comment: '所需成团人数'
            },
            group_id: {
                type: INTEGER,
                comment: '拼团ID'
            },
            expire: {
                type: INTEGER,
                defaultValue: 24,
                comment: '拼团时限',
            },
            status: {
                type: STRING(10),
                allowNull: false,
                defaultValue: '',
                comment: '拼团状态：pendding拼团中，success拼团成功，fail拼团失败',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('group_work');
    }
};