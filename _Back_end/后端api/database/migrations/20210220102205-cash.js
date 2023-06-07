'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('cash', {
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
            account: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '账户'
            },
            province: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '省'
            },
            city: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '市'
            },
            area: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '区'
            },
            path: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '地址'
            },
            bank: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '所属银行'
            },
            name: {
                type: STRING(50),
                allowNull: false,
                defaultValue: '',
                comment: '收款人'
            },
            status: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 1,
                comment: '状态'
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('cash');
    }
};