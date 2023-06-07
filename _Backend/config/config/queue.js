module.exports = config => {
    // 延时队列
    config.Queue = {
        redis: {
            port: 6379,
            host: '127.0.0.1',
            db: 3,
            password: null
        },
        defaultJobOptions: {
            attempts: 1,
            removeOnComplete: true,
            backoff: false,
            delay: 0
        },
        limiter: {
            max: 200000,
            duration: 1000
        },
        settings: {
            maxStalledCount: 1,
            guardInterval: 1, // 重新调度延迟
            retryProcessDelay: 500, // 发生内部错误时，在处理下一个作业之前延迟。
        }
    }
}