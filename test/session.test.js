'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/session.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#init
   */
  describe('init', async () => {
    it('should work', async () => {
      await driver.init({
        platformName: 'desktop',
        browserName: 'chrome',
      });
      assert.equal(server.ctx.method, 'POST');
      assert.equal(server.ctx.url, '/wd/hub/session');
      assert.deepEqual(server.ctx.request.body, {
        desiredCapabilities: {
          platformName: 'desktop',
          browserName: 'chrome',
          version: '',
          javascriptEnabled: true,
          platform: 'ANY',
        },
      });
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#quit
   */
  describe('quit', async () => {
    beforeEach(async () => {
      await driver.init({
        platformName: 'desktop',
        browserName: 'chrome',
      });
    });
    it('should work', async () => {
      await driver.quit();
      assert.equal(server.ctx.method, 'DELETE');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#sessions
   */
  describe('sessions', async () => {
    beforeEach(async () => {
      await driver.init({
        platformName: 'desktop',
        browserName: 'chrome',
      });
    });
    it('should work', async () => {
      await driver.sessions();
      assert.equal(server.ctx.method, 'GET');
      assert.equal(server.ctx.url, '/wd/hub/sessions');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
