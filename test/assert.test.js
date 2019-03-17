'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/asserter.test.js', function() {
  let driver, server;

  afterEach(() => {
    server.stop();
  });

  const mockServer = async (mockKey, mockValue) => {
    server = new Server();
    server.mock(mockKey, mockValue);
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
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome'
    });
  };

  /**
   * https://macacajs.github.io/macaca-wd/#assertAttribute
   */
  describe.only('assertAttribute', async () => {
    before(async () => {
      await mockServer('ctx.body', {
        sessionId: 'sessionId',
        status: 0,
        value: 'someClass'
      });
    });
    it('should work', async () => {
      await driver.assertAttribute('class', 'someClass');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      const { script, args } = server.ctx.request.body;
      assert.equal(
        script,
        "return window.__macaca_current_element.getAttribute('class')"
      );
      assert.equal(args.length, 0);
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#assertTitle
   */
  describe.only('assertTitle', async () => {
    before(async () => {
      await mockServer('ctx.body', {
        sessionId: 'sessionId',
        status: 0,
        value: 'someClass'
      });
    });
    it('should work', async () => {
      await driver.assertTitle('My Title');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/execute');
      assert.equal(server.ctx.method, 'POST');
      const { script, args } = server.ctx.request.body;
      assert.equal(
        script,
        "return window.__macaca_current_element.getAttribute('class')"
      );
      assert.equal(args.length, 0);
    });
  });
});
