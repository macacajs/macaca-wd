'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/asserter.test.js', function() {
  let driver, server;

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
  };

  afterEach(() => {
    server.stop();
  });

  beforeEach(async () => {
    await driver.init({
      platformName: 'desktop',
      browserName: 'chrome'
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#assertAttribute
   */
  describe('assertAttribute', async () => {
    before(async () => {
      mockServer('ctx.body', {
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
  describe('assertTitle', async () => {
    before(async () => {
      await mockServer('ctx.body', {
        sessionId: 'sessionId',
        status: 0,
        value: 'My Title'
      });
    });

    it('should work', async () => {
      await driver.assertTitle('My Title');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/title');
      assert.equal(server.ctx.method, 'GET');
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#hasElement
   */
  describe('hasElement', async () => {
    before(async () => {
      await mockServer('ctx.body', {
        sessionId: 'sessionId',
        status: 0,
        value: [{ ELEMENT: 1 }, { ELEMENT: 2 }]
      });
    });

    it('should work', async () => {
      await driver.hasElement('class', 'myClass');
      assert.equal(server.ctx.url, '/wd/hub/session/sessionId/elements');
      assert.equal(server.ctx.method, 'POST');
    });
  });
});
