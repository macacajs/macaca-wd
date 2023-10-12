'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/cookie.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#allCookies
   */
  describe('allCookies', async () => {
    it('should work', async () => {
      await driver.allCookies();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/cookie');
      assert.equal(server.ctx.method, 'GET');
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#deleteAllCookies
   */
  describe('deleteAllCookies', async () => {
    it('should work', async () => {
      await driver.deleteAllCookies();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/cookie');
      assert.equal(server.ctx.method, 'DELETE');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#deleteCookie
   */
  describe('deleteCookie', async () => {
    it('should work', async () => {
      await driver.deleteCookie('test_cookie');
      assert.equal(
        server.ctx.url,
        '/wd/hub/session/sessionId/cookie/test_cookie'
      );
      assert.equal(server.ctx.method, 'DELETE');
      assert.deepEqual(server.ctx.request.body, {});
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#setCookie
   */
  describe('setCookie', async () => {
    it('should work', async () => {
      await driver.setCookie('test_cookie');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/cookie');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.request.body, {
        cookie: 'test_cookie',
      });
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
