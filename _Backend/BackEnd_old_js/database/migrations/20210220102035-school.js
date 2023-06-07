'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('school', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '网校名称',
            },
            level_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '网校套餐id',
            },
            level_last_time: {
                type: DATE,
                comment: '授权过期时间',
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
            balance: {
                type: DECIMAL(10, 2),
                defaultValue: 0,
                comment: '可提现金额',
            },
            w_balance: {
                type: DECIMAL(10, 2),
                defaultValue: 0,
                comment: '待结算金额',
            },
            t_balance: {
                type: DECIMAL(10, 2),
                defaultValue: 0,
                comment: '总收入',
            },
            appid: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '店铺appid',
            },
            status: {
                type: INTEGER(1),
                defaultValue: 1,
                comment: '网校状态',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('school');
    }
};