'use strict';

const assert = require('assert');

const { Server } = require('./helper');
const { elFuncFullType, elFuncSuffix } = require('../wd/lib/utils');

const wd = require('../lib/macaca-wd');

describe('test/asserter.test.js', function() {
  let driver,
    server;

  const mockServer = async (mockKey, mockValue) => {
    server = new Server();
    server.mock(mockKey, mockValue);
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
  };

  describe('single method tests', () => {
    afterEach(() => {
      server.stop();
    });

    beforeEach(async () => {
      await driver.init({
        platformName: 'desktop',
        browserName: 'chrome',
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
          value: 'someClass',
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
          value: 'My Title',
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
          value: [{ ELEMENT: 1 }, { ELEMENT: 2 }],
        });
      });

      it('should work', async () => {
        await driver.hasElement('class', 'myClass');
        assert.equal(server.ctx.url, '/wd/hub/session/sessionId/elements');
        assert.equal(server.ctx.method, 'POST');
        const { using, value } = server.ctx.request.body;
        assert.equal(using, 'class');
        assert.equal(value, 'myClass');
      });
    });
  });

  /**
   * https://macacajs.github.io/macaca-wd/#hasElementByClassName
   * https://macacajs.github.io/macaca-wd/#hasElementByCss
   * https://macacajs.github.io/macaca-wd/#hasElementById
   * https://macacajs.github.io/macaca-wd/#hasElementByName
   * https://macacajs.github.io/macaca-wd/#hasElementByPartialLinkText
   * https://macacajs.github.io/macaca-wd/#hasElementByTagName
   * https://macacajs.github.io/macaca-wd/#hasElementByXPath
   */
  describe('hasElement type suffix method tests', async () => {
    afterEach(() => {
      server.stop();
    });

    beforeEach(async () => {
      await mockServer('ctx.body', {
        sessionId: 'sessionId',
        status: 0,
        value: [{ ELEMENT: 1 }, { ELEMENT: 2 }],
      });
      await driver.init({
        platformName: 'desktop',
        browserName: 'chrome',
      });
    });

    const tests = [
      'class name',
      'css',
      'id',
      'link text',
      'name',
      'partial link text',
      'tag name',
      'xpath',
    ].map(type => {
      return {
        functionSuffix: `hasElement${elFuncSuffix(type)}`,
        fullType: elFuncFullType(type),
      };
    });

    tests.forEach(function(test) {
      it(`${test.functionSuffix} should work`, async () => {
        await driver[test.functionSuffix]('myValue');
        assert.equal(server.ctx.url, '/wd/hub/session/sessionId/elements');
        assert.equal(server.ctx.method, 'POST');
        const { using, value } = server.ctx.request.body;
        assert.equal(using, test.fullType);
        assert.equal(value, 'myValue');
      });
    });
  });
});
