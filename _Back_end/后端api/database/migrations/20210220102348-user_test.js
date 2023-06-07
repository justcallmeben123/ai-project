'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('user_test', {
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
            testpaper_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '试卷id',
                references: {
                    model: 'testpaper',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
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
            answer_status: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 1,
                comment: '答题状态：1完成，0未完成',
            },
            read_status: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 0,
                comment: '阅卷状态：1完成，0未完成',
            },
            score: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '最终得分',
            },
            values: {
                type: TEXT('medium'),
                allowNull: true,
                comment: '问题答案和得分',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_test');
    }
};