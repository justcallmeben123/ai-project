module.exports = config => {
    config.sequelize = {
        dialect: 'mysql',
        host: '127.0.0.1',
        username: "ceshi8_dishaxy_c",
        password: 'LEa3JdaxZxFGetD4',
        port: 3306,
        database: 'ceshi8_dishaxy_c',
        // 中国时区
        timezone: '+08:00',
        define: {
            // 取消数据表名复数
            freezeTableName: true,
            // 自动写入时间戳 created_at updated_at
            timestamps: true,
            // 字段生成软删除时间戳 deleted_at
            // paranoid: true,
            createdAt: 'created_time',
            updatedAt: 'updated_time',
            // deletedAt: 'deleted_time',
            // 所有驼峰命名格式化
            underscored: true
        }
    }
}