'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Access = app.model.define('access', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '权限/菜单名称',
        },
        access_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '上级权限/菜单id'
        },
        content: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '权限/菜单内容',
        },
        method: {
            type: STRING(10),
            allowNull: false,
            defaultValue: 'GET',
            comment: '请求方式 GET/POST/PUT/DELETE',
        },
        ismenu: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '是否为菜单，0否1是',
        },
        hidden: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '是否隐藏 0否1是',
        },
        status: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '状态',
        },
        orderby: {
            type: INTEGER,
            defaultValue: 10,
            comment: '排序',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    return Access;
};