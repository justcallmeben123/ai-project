module.exports = config => {
    config.oss = {
        client: {
            accessKeyId: 'LTAI4G43qDESc0X7d16gR9y3',
            accessKeySecret: 'MG4Fns6rybrFrb72zLBLDjmPjp8ABy',
            bucket: 'demo-mp3',
            endpoint: 'oss-cn-shenzhen.aliyuncs.com',
            timeout: '60s',
        },
    };

    // 上传格式和大小限制
    config.multipart = {
        // fileSize: '50mb',
        fileSize: 1048576000,
        // mode: 'stream',
        mode: "file",
        fileExtensions: [
            '.jpg', '.jpeg', // image/jpeg
            '.png', // image/png, image/x-png
            '.gif', // image/gif
            '.mp3',
            '.mp4',
            '.avi',
            '.xls',
            '.xlsx',
        ],
    };

    // 腾讯云vod
    config.tencentVod = {
        secret_id: "AKIDMSH3dzZsYyDuKdvRyYtqdBcolnpduZkh",
        secret_key: "tZ0WptibG6pvqvu2vQuBCQhwyvcPxGVW",
        vodSubAppId: 1500000131
    }
}