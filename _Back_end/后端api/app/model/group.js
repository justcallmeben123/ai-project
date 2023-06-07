'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Group = app.model.define('group', {
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
        type: {
            type: STRING,
            allowNull: false,
            defaultValue: 'course',
            comment: '类型：course课程，column专栏'
        },
        goods_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '关联课程/专栏id',
        },
        price: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '拼团金额',
        },
        p_num: {
            type: INTEGER,
            defaultValue: 2,
            comment: '拼团人数',
        },
        auto: {
            type: INTEGER(1),
            defaultValue: 2,
            comment: '是否自动成团：0否1是',
        },
        expire: {
            type: INTEGER,
            defaultValue: 24,
            comment: '拼团时限',
        },
        status: {
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '状态'
        },
        start_time: DATE,
        end_time: DATE,
        created_time: DATE,
        updated_time: DATE,
    });

    Group.associate = function(models) {
        // 关联课程
        Group.belongsTo(app.model.Course, {
            foreignKey: 'goods_id'
        })

        // 关联专栏
        Group.belongsTo(app.model.Column, {
            foreignKey: 'goods_id'
        })
    }

    return Group;
};