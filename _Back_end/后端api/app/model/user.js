'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const User = app.model.define('user', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: STRING(30),
            allowNull: true,
            defaultValue: '',
            comment: '用户名',
            unique: true
        },
        nickname: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '昵称',
        },
        email: {
            type: STRING(160),
            allowNull: true,
            comment: '邮箱',
            unique: true,
            get() {
                const email = this.getDataValue('email');
                return app.hiddenEmail(email)
            }
        },
        password: {
            type: STRING,
            allowNull: true,
            defaultValue: '',
            comment: "密码",
            set(val) {
                this.setDataValue('password', app.createPassword(val))
            }
        },
        avatar: {
            type: STRING,
            allowNull: true,
            defaultValue: '',
            comment: '头像'
        },
        phone: {
            type: STRING(11),
            allowNull: true,
            comment: '手机',
            unique: true,
            get() {
                const phone = this.getDataValue('phone');
                return app.hiddenPhone(phone)
            }
        },
        weixin_unionid: {
            type: STRING,
            allowNull: true,
            comment: '微信unionid',
            unique: true,
        },
        sex: {
            type: STRING(4),
            allowNull: false,
            defaultValue: '未知',
            comment: '性别'
        },
        desc: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '个性签名',
        },
        status: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '状态',
        },
        created_time: DATE,
        updated_time: DATE,

    });


    // User.associate = function (models) {
    //     // 关联角色
    //     User.hasMany(app.model.UserRole);
    //     User.belongsToMany(app.model.Role, { as: 'userRoles', through: 'user_role', foreignKey: 'user_id' })

    //     // 关联员工
    //     User.hasMany(app.model.Schoolstaff);
    // }

    return User;
};