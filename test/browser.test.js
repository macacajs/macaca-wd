'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/browser.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#back
   */
  describe('back', async () => {
    it('should work', async () => {
      await driver.back();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/back');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#forward
   */
  describe('forward', async () => {
    it('should work', async () => {
      await driver.forward();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/forward');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#get
   */
  describe('get', async () => {
    it('should work', async () => {
      await driver.get('https://github.com');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/url');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.request.body.url, 'https://github.com');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#maximize
   */
  describe('maximize', async () => {
    it('should work', async () => {
      await driver.maximize();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/window/current/maximize');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#maximize
   */
  describe('refresh', async () => {
    it('should work', async () => {
      await driver.refresh();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/refresh');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
