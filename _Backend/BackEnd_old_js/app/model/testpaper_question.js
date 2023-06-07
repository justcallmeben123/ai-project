'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const TestpaperQuestion = app.model.define('testpaper_question', {
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

    TestpaperQuestion.associate = function(models) {
        TestpaperQuestion.belongsTo(app.model.Question);
        TestpaperQuestion.belongsTo(app.model.Testpaper);
    }

    return TestpaperQuestion;
};