'use strict';

const fs = require('fs');
const _ = require('xutil');
const Promise = require('bluebird');
const program = require('commander');
const {
  opn,
  platform,
  isExistedFile,
  uuid,
  mkdir
} = _;
const path = require('path');
const {
  appendToContext
} = require('macaca-reporter');
const { assert } = require('chai');
const domEventLib = require.resolve('dom-event-simulate');
const domEventLibSource = fs.readFileSync(domEventLib, 'utf8');

program
  .allowUnknownOption()
  .option('--coverage-ignore [coverageIgnore]', 'ignore RegExp for coverage ')
  .parse(process.argv);

const shouldContains = (...substrs) => str => {
  substrs.forEach(substr => assert.include(str, substr));
};

const xlogger = require('xlogger');

const logger = xlogger.Logger({
  closeFile: true
});

const cwd = process.cwd();

const DataHubClient = require('datahub-nodejs-sdk');

const datahubClient = new DataHubClient();

const MACACA_RUN_IN_PARALLEL = !!process.env.MACACA_RUN_IN_PARALLEL;

const uuidForParallel = _.uuid();

const safeQuote = string => JSON.stringify(String(string));

const extendsMixIn = wd => {
  /**
   * Initial browser window.
   * @name initWindow
   * @summary Support: Web(WebView)
   * @param {object} browser options.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('initWindow', function(options = {}) {
    return this
      .init(Object.assign({
        platformName: 'desktop',
        browserName: 'electron',
        deviceScaleFactor: 2
      }, options))
      .setWindowSize(options.width, options.height);
  });

  /**
   * Get webpage from url util the page ready.
   * @name getUrl
   * @summary Support: Web(WebView)
   * @param {string} the pointed url.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('getUrl', function(url) {
    const p = MACACA_RUN_IN_PARALLEL ? this.setCookie({
      url,
      name: 'DATAHUB_CACHE_TAG',
      value: uuidForParallel
    }) : this;
    return p
      .get(url)
      .execute('return location.protocol')
      .then(protocol => {
        if (!~['http:', 'https:'].indexOf(protocol)) {
          return new Promise(resolve => {
            const handle = () => {
              setTimeout(() => {
                this
                  .get(url)
                  .execute('return location.protocol')
                  .then(protocol => {
                    if (~['http:', 'https:'].indexOf(protocol)) {
                      setTimeout(resolve, 3000);
                    } else {
                      handle();
                    }
                  });
              }, 1000);
            };
            handle();
          });
        }
      });
  });

  wd.addPromiseChainMethod('getUrlByAsyncRender', function(url) {
    const p = MACACA_RUN_IN_PARALLEL ? this.setCookie({
      url,
      name: 'DATAHUB_CACHE_TAG',
      value: uuidForParallel
    }) : this;
    return p
      .get(url)
      .execute('return document.querySelectorAll(".root-app").length')
      .then(number => {
        if (number === 0) {
          return new Promise(resolve => {
            const handle = () => {
              setTimeout(() => {
                this
                  .get(url)
                  .execute('return document.querySelectorAll(".root-app").length')
                  .then(number => {
                    if (number !== 0) {
                      resolve();
                    } else {
                      handle();
                    }
                  });
              }, 3000);
            };
            handle();
          });
        }
      });
  });

  wd.addPromiseChainMethod('getUrlByExecuteScripts', function(url, scriptStr, successHandle) {
    const p = MACACA_RUN_IN_PARALLEL ? this.setCookie({
      url,
      name: 'DATAHUB_CACHE_TAG',
      value: uuidForParallel
    }) : this;
    return p
      .get(url)
      .execute(scriptStr)
      .then(res => {
        if (!successHandle(res)) {
          return new Promise(resolve => {
            const handle = () => {
              setTimeout(() => {
                this
                  .get(url)
                  .execute(scriptStr)
                  .then(res => {
                    if (successHandle(res)) {
                      resolve();
                    } else {
                      handle();
                    }
                  });
              }, 1000);
            };
            handle();
          });
        }
      });
  });

  /**
   * Save screenshots to ./screenshots.
   * @name saveScreenshots
   * @summary Support: Web(WebView)
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('saveScreenshots', function(context) {
    const reportspath = path.join(cwd, 'reports');
    const filepath = path.join(reportspath, 'screenshots', `${uuid()}.png`);
    mkdir(path.dirname(filepath));

    return this
      .saveScreenshot(filepath)
      .then(() => {
        appendToContext(context, `${path.relative(reportspath, filepath)}`);
      });
  });

  /**
   * Generate the coverage reporter.
   * @name coverage
   * @summary Support: Web(WebView)
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('coverage', function(context) {
    const tempDir = path.join(cwd, 'coverage', '.temp');
    _.mkdir(tempDir);
    return this
      .execute('return window.__coverage__')
      .then(__coverage__ => {
        if (!__coverage__) {
          return this
            .execute('return location.href')
            .then(url => {
              logger.info(`>> coverage failed: ${url}`);
            });
        }
        const file = path.join(tempDir, `${+new Date()}_coverage.json`);
        if (program.coverageIgnore) {
          const ignoreReg = new RegExp(program.coverageIgnore, 'i');
          for (const k in __coverage__) {
            if (ignoreReg.test(k)) {
              delete __coverage__[k];
            }
          }
        }
        fs.writeFileSync(file, JSON.stringify(__coverage__, null, 2));
      })
      .catch(e => {
        console.log(e);
      });
  });

  /**
   * Open all reporters in browser.
   * @name openReporter
   * @summary Support: Web(WebView)
   * @param {boolean} if open.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('openReporter', function(open) {
    if (!open || !platform.isOSX) {
      return this;
    }

    const file1 = path.join(cwd, 'reports', 'index.html');
    const file2 = path.join(cwd, 'coverage', 'index.html');

    if (isExistedFile(file1)) {
      opn(file1);
    }

    if (isExistedFile(file2)) {
      opn(file2);
    }

    return this;
  });

  /**
   * Switch scene with DataHub.
   * @name switchScene
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type datahub
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchScene', function(args) {
    if (MACACA_RUN_IN_PARALLEL) {
      args.tagName = uuidForParallel;
    }
    return datahubClient.switchScene(args);
  });
  /**
   * Switch multi-scene with DataHub.
   * @name switchMultiScenes
   * @summary Support: Web(WebView)
   * @param {array} the scene list.
   * @type datahub
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchMultiScenes', function(args) {
    if (MACACA_RUN_IN_PARALLEL) {
      args = args.map(arg => {
        return Object.assign({}, arg, {
          tagName: uuidForParallel
        });
      });
    }
    return datahubClient.switchMultiScenes(args);
  });
  /**
   * Switch all scenes with DataHub.
   * @name switchAllScenes
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type datahub
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchAllScenes', function(args) {
    if (MACACA_RUN_IN_PARALLEL) {
      args.tagName = uuidForParallel;
    }
    return datahubClient.switchAllScenes(args);
  });

  /**
   * Type content to input element.
   * @name formInput
   * @summary Support: Web(WebView)
   * @param {string} content of type.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('formInput', function(string) {
    const uuid = Date.now();
    const list = Array.prototype.slice.call(string);

    if (!list.length) {
      return this;
    }

    let value = '';

    return Promise.each(list, (item) => {
      value += item;
      const script = `
      (function() {
        var element = window.__macaca_current_element;
        var setValue = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        setValue.call(element, ${safeQuote(value)});
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        element.dispatchEvent(event);
      })()
      `;
      return this
        .execute(script)
        .sleep(10);
    });
  });

  /**
   * Type content to a contentEditable element.
   * @name elementInput
   * @summary Support: Web(WebView)
   * @param {string} content of type.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('elementInput', function(string) {
    const uuid = Date.now();
    const list = Array.prototype.slice.call(string);

    if (!list.length) {
      return this;
    }

    let value = '';

    return Promise.each(list, (item) => {
      value += item;
      const script = `
      (function() {
        var element = window.__macaca_current_element;
        var setValue = Object.getOwnPropertyDescriptor(
          window.Element.prototype,
          'innerHTML'
        ).set;
        setValue.call(element, ${safeQuote(value)});
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        element.dispatchEvent(event);
      })()
      `;
      return this
        .execute(script)
        .sleep(10);
    });
  });

  /**
   * Simulate the dom event.
   * @name domEvent
   * @summary Support: Web(WebView)
   * @param {string} eventType of the event.
   * @param {object} options of the event.
   * @see https://github.com/macacajs/dom-event-simulate#support-events
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('domEvent', function(eventName, options) {
    const uuid = Date.now();
    const script = `
      ${domEventLibSource}
      var _element_${uuid} = window.__macaca_current_element;
      _macaca_simulate.domEvent(_element_${uuid}, '${eventName}', ${JSON.stringify(options)});
    `;
    return this
      .execute(script);
  });

  /**
   * Check if element has pointed text.
   * @name hasText
   * @summary Support: Web(WebView)
   * @param {string} text content.
   * @type assert
   * @returns {Promise.<boolean>}
   */
  wd.addElementPromiseChainMethod('hasText', function (...texts) {
    return this
      .text()
      .then(shouldContains(...texts));
  });

  /**
   * Check if element is existed.
   * @name hasElementByCss
   * @summary Support: Web(WebView)
   * @param {string} text content.
   * @type assert
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('hasElementByCss', function (cssSelector) {
    return this
      .elementByCssIfExists(cssSelector)
      .then(d => {
        if (!d) {
          throw new Error(`Element ${cssSelector} should be existed.`);
        }
      });
  });

  /**
   * Check if title exists.
   * @name assertTitle
   * @summary Support: Web(WebView)
   * @param {string} title of the web page.
   * @type assert
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('assertTitle', function (title) {
    return this
      .title()
      .then(realTitle => {
        assert(title === realTitle, `expect title to be '${title}' but got ${realTitle}`);
      });
  });

  /**
   * Check if element's attribute right.
   * @name assertAttribute
   * @summary Support: Web(WebView)
   * @param {string} attribute's name.
   * @param {string} expected value.
   * @type assert
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('assertAttribute', function (attribute, value) {
    return this
      .execute(`return window.__macaca_current_element.getAttribute('${attribute}')`)
      .then(realValue => {
        assert(value === realValue, `expect attribute ${attribute} to be '${value}' but got '${realValue}'`);
      });
  });
};

module.exports = (wd, options = {}) => {
  extendsMixIn(wd);

  const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: options.macacaServerPort || process.env.MACACA_SERVER_PORT || 3456
  });

  driver.configureHttp({
    timeout: 20 * 1000,
    retries: 5,
    retryDelay: 5
  });

  const webpackDevServerPort = options.port || 8080;

  const BASE_URL = `http://127.0.0.1:${webpackDevServerPort}`;

  return {
    driver,
    BASE_URL,
    webpackDevServerPort
  };
};

module.exports.extendsMixIn = extendsMixIn;

