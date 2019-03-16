'use strict';

const assert = require('assert');
const path = require('path');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/macaca-wd.test.js', function() {
  let driver, server;
  before(() => {
    server = new Server();
    server.start();
    const remoteConfig = {
      host: 'localhost',
      port: 3456
    };

    driver = wd.promiseChainRemote(remoteConfig);
    driver.configureHttp({
      timeout: 20 * 1000,
      retries: 5,
      retryDelay: 5
    });
  });

  after(() => {
    server.stop();
  });

  it('init should be ok', async () => {
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome'
    });
    assert.equal(server.ctx.url, '/wd/hub/session');
  });

  it('get is ok', async () => {
    await driver.get('baidu.com');
    assert.equal(server.ctx.url, '/wd/hub/session/sessionId/url');
    assert.equal(server.ctx.request.body.url, 'baidu.com');
  });
});
