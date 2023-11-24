'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/utility.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#openReporter
   */
  describe.skip('openReporter', async () => {
    it('should work', async () => {
      await driver.openReporter(false);
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#saveScreenshots
   */
  describe('saveScreenshots', async () => {
    afterEach(function() {
      return driver.saveScreenshots(this);
    });
    it('should work', async () => {
      assert.ok(driver);
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#elementStatus
   */
  describe('elementStatus', async () => {
    it('should work', async () => {
      await driver.elementStatus();
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#page
   */
  describe('page', async () => {
    it('should work', async () => {
      await driver.page('url');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#pagePopup
   */
  describe('pagePopup', async () => {
    it('should work', async () => {
      await driver.pagePopup('url');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#locator
   */
  describe('locator', async () => {
    it('should work', async () => {
      await driver.locator('');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#pageIframe
   */
  describe('pageIframe', async () => {
    it('should work', async () => {
      await driver.pageIframe('url');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#browser
   */
  describe('browser', async () => {
    it('should work', async () => {
      await driver.browser('version');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/next');
      assert.equal(server.ctx.method, 'POST');
      assert.deepEqual(server.ctx.response.body, {
        sessionId: 'sessionId',
        status: 0,
        value: '',
      });
    });
  });
});
