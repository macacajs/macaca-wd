'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/alert.test.js', function() {
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

  beforeEach(async () => {
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome',
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#acceptAlert
   */
  describe('acceptAlert', async () => {
    it('should work', async () => {
      await driver.acceptAlert();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/accept_alert');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#alertKeys
   */
  describe('alertKeys', async () => {
    it('should work', async () => {
      await driver.alertKeys('test_key');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/alert_text');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.request.body, { text: 'test_key' });
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#alertText
   */
  describe('alertText', async () => {
    it('should work', async () => {
      await driver.alertText();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/alert_text');
      assert.equal(server.ctx.method, 'GET');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#dismissAlert
   */
  describe('dismissAlert', async () => {
    it('should work', async () => {
      await driver.dismissAlert();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/dismiss_alert');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
