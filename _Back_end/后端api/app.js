const Queue = require('bull');
const path = require('path');
const NodeMediaServer = require('node-media-server');
class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
    }

    configDidLoad() {
        // Config, plugin files have been loaded.
    }

    async didLoad() {
        // All files have loaded, start plugin here.
        this.app.Queue = new Queue('autoCloseOrder', {
            ...this.app.config.Queue
        });

        this.app.Queue.on('global:completed', jobId => {
            console.log(`Job ${jobId} is 完成!`)
        })

        // this.app.Queue.on('global:failed', (jobId, err) => {
        //     console.log(`失败!`)
        //     console.log(jobId, err)
        // })


        // 任务内容
        this.app.loader.loadFile(path.join(this.app.options.baseDir, 'app/queue/queue.js'))
        
        
        // 启动流媒体服务
        if (!this.app.nms) {
            this.app.nms = new NodeMediaServer(this.app.config.mediaServer)
            this.app.nms.run();

            this.app.nms.on('preConnect', (id, args) => {
                console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
                // let session = nms.getSession(id);
                // session.reject();
            });

            this.app.nms.on('postConnect', (id, args) => {
                console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
            });

            this.app.nms.on('doneConnect', (id, args) => {
                console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
            });

            this.app.nms.on('prePublish', (id, StreamPath, args) => {
                console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
                // let session = nms.getSession(id);
                // session.reject();
            });

            this.app.nms.on('postPublish', (id, StreamPath, args) => {
                console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            });

            // 停止推流
            this.app.nms.on('donePublish', (id, StreamPath, args) => {
                console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

                let s = StreamPath.split('/')
                const key = s[2]

            });

            this.app.nms.on('prePlay', (id, StreamPath, args) => {
                console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
                // let session = nms.getSession(id);
                // session.reject();
            });

            this.app.nms.on('postPlay', (id, StreamPath, args) => {
                console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            });

            this.app.nms.on('donePlay', (id, StreamPath, args) => {
                console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            });
        }

    }

    async willReady() {
        // All plugins have started, can do some thing before app ready
    }

    async didReady() {
        // Worker is ready, can do some things
        // don't need to block the app boot.
    }

    async serverDidReady() {
        // Server is listening.
    }

    async beforeClose() {
        // Do some thing before app close.
    }
}

module.exports = AppBootHook;