'use strict';

const assert = require('assert');

const { Server } = require('./helper');

const wd = require('../lib/macaca-wd');

describe('test/cookie.test.js', function() {
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
   * https://macacajs.github.io/macaca-wd/#allCookies
   */
  describe('allCookies', async () => {
    it('should work', async () => {

    });
  });

    /**
   * https://macacajs.github.io/macaca-wd/#deleteAllCookies
   */
  describe('deleteAllCookies', async () => {
    it('should work', async () => {

    });
  });

    /**
   * https://macacajs.github.io/macaca-wd/#deleteCookie
   */
  describe('deleteCookie', async () => {
    it('should work', async () => {

    });
  });

    /**
   * https://macacajs.github.io/macaca-wd/#setCookie
   */
  describe('setCookie', async () => {
    it('should work', async () => {

    });
  });
});