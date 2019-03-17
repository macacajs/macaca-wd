'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/utility.test.js', function() {
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

  beforeEach(async () => {
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome'
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#coverage
   */
  describe('coverage', async () => {
    it('should work', async () => {
      await driver.coverage();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#domEvent
   */
  describe('domEvent', async () => {
    it('should work', async () => {
      await driver.domEvent();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      assert.ok(server.ctx.request.body.script);
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#elementInput
   */
  describe('elementInput', async () => {
    it('should work', async () => {
      await driver.elementInput('content');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      assert.ok(server.ctx.request.body.script);
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#formInput
   */
  describe('formInput', async () => {
    it('should work', async () => {
      await driver.formInput('content');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      assert.ok(server.ctx.request.body.script);
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#getUrl
   */
  describe.skip('getUrl', async () => {
    it('should work', async () => {
      await driver.getUrl('https://github.com');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      assert.ok(server.ctx.request.body.script);
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
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/window/current/size');
      assert.equal(server.ctx.method, 'POST');
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
   * https://macacajs.github.io/macaca-wd/#openReporter
   */
  describe.skip('openReporter', async () => {
    it('should work', async () => {
      await driver.openReporter();
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#saveScreenshots
   */
  describe('saveScreenshots', async () => {
    it('should work', async () => {
      await driver.saveScreenshots();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/screenshot');
      assert.equal(server.ctx.method, 'GET');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
