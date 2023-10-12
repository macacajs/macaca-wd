'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/execute.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#source
   */
  describe('execute', async () => {
    it('should work', async () => {
      await driver.execute('return window');
      assert.equal(server.ctx.method, 'POST');
      assert.equal(server.ctx.url, '/wd/hub/session/execute');
      assert.deepEqual(server.ctx.request.body, {
        args: [],
        script: 'return window',
      });
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});

