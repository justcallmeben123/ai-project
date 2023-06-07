'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('user', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: STRING(30),
                allowNull: false,
                defaultValue: '',
                comment: '用户名',
                unique: true
            },
            nickname: {
                type: STRING(30),
                allowNull: false,
                defaultValue: '',
                comment: '昵称',
            },
            email: {
                type: STRING(160),
                comment: '邮箱',
                unique: true
            },
            password: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: "密码"
            },
            avatar: {
                type: STRING,
                allowNull: true,
                defaultValue: '',
                comment: '头像'
            },
            phone: {
                type: STRING(11),
                comment: '手机',
                unique: true
            },
            sex: {
                type: STRING(4),
                allowNull: false,
                defaultValue: '未知',
                comment: '性别'
            },
            desc: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '个性签名',
            },
            status: {
                type: INTEGER(1),
                defaultValue: 1,
                comment: '状态',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user');
    }
};