'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('post', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            bbs_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '所属社群id',
                references: {
                    model: 'bbs',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            content: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '课程名称',
            },
            user_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '发帖人id',
                references: {
                    model: 'user',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            comment_count: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '评论数'
            },
            support_count: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '点赞数'
            },
            is_top: {
                type: INTEGER(1),
                defaultValue: 0,
                comment: '是否置顶 0否1是',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('post');
    }
};