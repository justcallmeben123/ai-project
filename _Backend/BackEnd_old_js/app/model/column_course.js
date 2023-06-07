'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const ColumnCourse = app.model.define('column_course', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        column_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '专栏id',
            references: {
                model: 'column',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        course_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '课程id',
            references: {
                model: 'course',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        look_count: {
            type: INTEGER,
            defaultValue: 0,
            comment: '访问数',
        },
        orderby: {
            type: INTEGER,
            defaultValue: 10,
            comment: '排序',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    ColumnCourse.associate = function(models) {
        // 关联课程
        ColumnCourse.belongsTo(app.model.Course);
    }

    return ColumnCourse;
};