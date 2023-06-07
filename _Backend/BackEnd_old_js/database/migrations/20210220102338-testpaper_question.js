'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('testpaper_question', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
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
            question_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '题目id',
                references: {
                    model: 'question',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            score: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '题目分数',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('testpaper_question');
    }
};