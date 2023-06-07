module.exports = config => {
    // redis存储
    config.redis = {
        client: {
            port: 6379, // Redis port
            host: '127.0.0.1', // Redis host
            password: '',
            db: 2,
        },
    };
}