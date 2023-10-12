'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/title.test.js', function() {
  let driver,
    server;
  before(() => {
    server = new Server();
    server.start();
    const remoteConfig = {
      host: 'localhost',
      port: 3456,
    };

    driver = wd.promiseChainRemote(remoteConfig);
    driver.configureHttp({
      timeout: 20 * 1000,
      retries: 5,
      retryDelay: 5,
    });
  });

  after(() => {
    server.stop();
  });

  /**
   * https://macacajs.github.io/macaca-wd/#title
   */
  describe('title', async () => {
    it('should work', async () => {
      await driver.title();
      assert.equal(server.ctx.method, 'GET');
      assert.equal(server.ctx.url, '/wd/hub/session/title');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});

