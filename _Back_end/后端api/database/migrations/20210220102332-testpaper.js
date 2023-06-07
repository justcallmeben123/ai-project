'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('testpaper', {
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
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('testpaper');
    }
};