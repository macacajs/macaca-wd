'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/macaca-wd.test.js', function() {
  let driver, server;
  beforeEach(() => {
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

  afterEach(() => {
    server.stop();
    process.exit(0);
  });

  it('init should be ok', async () => {
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome',
    });
    assert.equal(server.ctx.url, '/wd/hub/session');
  });
});
