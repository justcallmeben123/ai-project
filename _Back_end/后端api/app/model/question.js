'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Question = app.model.define('question', {
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
        title: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '题目标题',
        },
        remark: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '注释',
        },
        type: {
            type: STRING(50),
            allowNull: false,
            defaultValue: 'radio',
            comment: '类型：radio单选，checkbox多选，trueOrfalse判断，answer问答，completion填空',
        },
        value: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '答案和选项',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    return Question;
};