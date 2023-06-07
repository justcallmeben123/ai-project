'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Testpaper = app.model.define('testpaper', {
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
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '试卷标题',
        },
        total_score: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '总分',
        },
        pass_score: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '及格分',
        },
        expire: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '考试时长，分钟',
        },
        status: {
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 1,
            comment: '状态',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Testpaper.associate = function(models) {
        Testpaper.hasMany(app.model.TestpaperQuestion);
        // 关联用户考试
        Testpaper.hasMany(app.model.UserTest);
    }

    return Testpaper;
};