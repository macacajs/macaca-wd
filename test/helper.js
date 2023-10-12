'use strict';

const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const stoppable = require('stoppable');
const _ = require('lodash');

class Server {
  constructor(options) {
    this.options = Object.assign(
      {
        port: 3456,
      },
      options || {}
    );
    this.app = new Koa();
    this.app.use(bodyParser());
  }

  mock(key, value) {
    this.app.use(async (ctx, next) => {
      await next();
      this.ctx = ctx;
      _.set(this, key, value);
    });
    this.mocked = true;
  }

  start() {
    if (!this.mocked) {
      this.app.use(async (ctx, next) => {
        await next();
        this.ctx = ctx;
        this.ctx.body = {
          sessionId: 'sessionId',
          status: 0,
          value: '',
        };
      });
    }
    this.server = stoppable(
      http.createServer(this.app.callback()).listen(this.options.port)
    );
  }

  stop() {
    this.server.stop();
  }
}

module.exports.Server = Server;
