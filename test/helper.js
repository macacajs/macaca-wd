'use strict';

const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const stoppable = require('stoppable');

class Server {
  constructor(options) {
    this.options = Object.assign(
      {
        port: 3456
      },
      options || {}
    );
  }

  start() {
    const app = new Koa();
    app.use(bodyParser());
    app.use(async (ctx, next) => {
      await next();
      this.ctx = ctx;
      this.ctx.body = {
        sessionId: 'sessionId',
        status: 0,
        value: ''
      };
    });
    this.server = stoppable(
      http.createServer(app.callback()).listen(this.options.port)
    );
    console.log('server listening on', this.options.port);
  }

  stop() {
    this.server.stop();
  }
}

module.exports.Server = Server;
