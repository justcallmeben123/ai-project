'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('renovation', {
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
            title: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '页面标题'
            },
            isdefault: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 0,
                comment: '默认页面，不可删除',
            },
            type: {
                type: STRING,
                allowNull: false,
                defaultValue: 'common',
                comment: '页面类型：index首页，common公共页',
            },
            ismobile: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 1,
                comment: '是否是移动端：0PC端，1移动端',
            },
            template: {
                type: TEXT('medium'),
                allowNull: true,
                comment: '模板数据',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('renovation');
    }
};