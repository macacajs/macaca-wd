'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/window.test.js', function() {
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
     * https://macacajs.github.io/macaca-wd/#close
     */
  describe('close', async () => {
    it('should work', async () => {
      await driver.close();
      assert.equal(server.ctx.method, 'DELETE');
      assert.equal(server.ctx.url, '/wd/hub/session/window');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
     * https://macacajs.github.io/macaca-wd/#getWindowSize
     */
  describe('getWindowSize', async () => {
    it('should work', async () => {
      await driver.getWindowSize();
      assert.equal(server.ctx.method, 'GET');
      assert.equal(server.ctx.url, '/wd/hub/session/window/current/size');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
     * https://macacajs.github.io/macaca-wd/#setWindowSize
     */
  describe('setWindowSize', async () => {
    it('should work', async () => {
      await driver.setWindowSize(800, 600);
      assert.equal(server.ctx.method, 'POST');
      assert.equal(server.ctx.url, '/wd/hub/session/window/current/size');
      assert.deepEqual(server.ctx.request.body, {
        width: 800,
        height: 600,
      });
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
     * https://macacajs.github.io/macaca-wd/#window
     */
  describe('window', async () => {
    it('should work', async () => {
      await driver.window();
      assert.equal(server.ctx.method, 'POST');
      assert.equal(server.ctx.url, '/wd/hub/session/window');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
     * https://macacajs.github.io/macaca-wd/#windowHandle
     */
  describe('windowHandle', async () => {
    it('should work', async () => {
      await driver.windowHandle();
      assert.equal(server.ctx.method, 'GET');
      assert.equal(server.ctx.url, '/wd/hub/session/window_handle');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
     * https://macacajs.github.io/macaca-wd/#windowHandles
     */
  describe('windowHandles', async () => {
    it('should work', async () => {
      await driver.windowHandles();
      assert.equal(server.ctx.method, 'GET');
      assert.equal(server.ctx.url, '/wd/hub/session/window_handles');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });


  /**
   * https://macacajs.github.io/macaca-wd/#initWindow
   */
  describe('initWindow', async () => {
    it('should work', async () => {
      await driver.initWindow({
        width: 800,
        height: 600,
      });
      assert.equal(
        server.ctx.url,
        '/wd/hub/session'
      );
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});

