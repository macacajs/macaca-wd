'use strict';

const Koa = require('koa');

class Server {
  constructor(options) {
    this.options = Object.assign({
      port: 3456,
    }, options || {});
  }

  start() {
    this.app = new Koa();
    this.app.use(async(ctx, next) => {
      await next();
      this.ctx = ctx;
      this.ctx.body = {
        sessionId: 'sessionId',
        status: 0,
        value: ''
      };
    });
    this.server = this.app.listen(this.options.port);
    console.log('server listening on', this.options.port);
  }

  stop() {
    this.server.close();
  }

}

module.exports.Server = Server;