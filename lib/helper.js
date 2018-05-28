'use strict';

const _ = require('xutil');
const Promise = require('bluebird');
const remap = require('remap-istanbul/lib/remap');
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
const Coverage = require('macaca-coverage');
const { assert } = require('chai');

const shouldContains = (...substrs) => str => {
  substrs.forEach(substr => assert.include(str, substr));
};

const {
  collector,
  Reporter
} = Coverage({
  runtime: 'web'
});

const xlogger = require('xlogger');

const logger = xlogger.Logger({
  closeFile: true
});

const cwd = process.cwd();

const DataHubClient = require('datahub-nodejs-sdk');

const datahubClient = new DataHubClient();

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
    return this
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
    const filepath = path.join(cwd, 'screenshots', `${uuid()}.png`);
    const reportspath = path.join(cwd, 'reports');
    mkdir(path.dirname(filepath));

    return this
      .saveScreenshot(filepath)
      .then(() => {
        appendToContext(context, `${path.relative(reportspath, filepath)}`);
      });
  });

  /**
   * Set the config of coverage.
   * @name configCoverage
   * @summary Support: Web(WebView)
   * @param {object} options of coverage.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('configCoverage', function(options) {
    this.__coverrageOptions = options;
  });

  /**
   * Generate the coverage reporter.
   * @name coverage
   * @summary Support: Web(WebView)
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('coverage', function(context) {
    const coverageHtml = path.join(cwd, 'coverage', 'index.html');
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
        const reporter = new Reporter();

        if (this.__coverrageOptions && this.__coverrageOptions.useRemap) {
          const _collector = remap(__coverage__, {
            warn: () => {},
            warnMissingSourceMaps: false
          });
          collector.add(_collector.getFinalCoverage());
        } else {
          collector.add(__coverage__);
        }

        reporter.addAll([
          'html',
          'lcov',
          'json'
        ]);
        return new Promise(resolve => {
          reporter.write(collector, true, () => {
            logger.debug(`>> coverage: ${coverageHtml}`);
            resolve('ok');
          });
        });
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
  wd.addPromiseChainMethod('switchScene', function({
    hub: projectId,
    pathname,
    scene = 'default',
    delay = '0',
    status: statusCode = '200',
    headers: responseHeaders = {}
  }) {
    return datahubClient.updateSceneByProjectIdAndDataId(projectId, pathname, {
      currentScene: scene,
      delay,
      statusCode,
      responseHeaders
    });
  });

  /**
   * Switch multi-scene with DataHub.
   * @name switchMultiScenes
   * @summary Support: Web(WebView)
   * @param {array} the scene list.
   * @type datahub
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchMultiScenes', function(data = []) {
    return datahubClient.updateMultiData(data.map(item => {
      return {
        projectId: item.hub,
        dataId: item.pathname,
        currentScene: item.scene || 'default',
        delay: item.delay || '0',
        statusCode: item.status || '200',
        responseHeaders: item.responseHeaders || {}
      };
    }));
  });

  /**
   * Switch all scenes with DataHub.
   * @name switchAllScenes
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type datahub
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchAllScenes', function({
    hub: projectId,
    scene = 'default',
    delay = '0',
    status: statusCode = '200',
    headers: responseHeaders = {}
  }) {
    return datahubClient
      .getDataListByProjectId(projectId)
      .then(dataList => {
        if (!(dataList.success && Array.isArray(dataList.data))) {
          throw new Error('switch all scenes failed');
        }
        const dataIdList = dataList.data.map(item => item.pathname);
        return Promise.all(dataIdList.map(pathname => {
          return datahubClient
            .updateSceneByProjectIdAndDataId(projectId, pathname, {
              currentScene: scene,
              delay,
              statusCode,
              responseHeaders
            });
        }));
      });
  });

  /**
   * Type content to input element.
   * @name formatInput
   * @summary Support: Web(WebView)
   * @param {string} content of type.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('formatInput', function(string) {
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
   * Simulate the element touch event.
   * @name elementTouch
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('elementTouch', function(options) {
    const uuid = Date.now();
    const config = Object.assign({
      type: 'start',
      force: 1,
      identifier: uuid,
      pageX: 0,
      pageY: 0
    }, options);
    config.type = config.type.toLowerCase();
    config.screenX = config.screenX || config.pageX;
    config.screenY = config.screenY || config.pageY;
    const eventHandle = `
      var touch_${uuid} = new Touch(_config_${uuid});
      var touchEvent_${uuid} = new TouchEvent('touch${config.type}', {
        bubbles: true,
        touches: [touch_${uuid}],
        targetTouches: [touch_${uuid}],
        changedTouches: [touch_${uuid}]
      });
      _element_${uuid}.dispatchEvent(touchEvent_${uuid});
    `;
    const script = `
      var _element_${uuid} = window.__macaca_current_element;
      var _config_${uuid} = ${JSON.stringify(config)};
      _config_${uuid}.target = _element_${uuid};
      ${eventHandle}
    `;
    return this
      .execute(script)
      .sleep(100);
  });

  /**
   * Simulate the keyboard event.
   * @name keyboardEvent
   * @summary Support: Web(WebView)
   * @param {string} eventType of the event.
   * @param {number} keyCode of the event.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('keyboardEvent', function(eventType = 'keydown', keyCode = 13) {
    // TODO
    // HTMLEvents
    eventType = eventType.toLowerCase();
    const uuid = Date.now();
    const script = `
      var _element_${uuid} = window.__macaca_current_element;
      var event_${uuid} = document.createEvent('UIEvents');
      event_${uuid}.initUIEvent('${eventType}', true, true, window, 0);
      event_${uuid}.keyCode = ${keyCode};
      _element_${uuid}.dispatchEvent(event_${uuid});
    `;
    return this
      .execute(script)
      .sleep(100);
  });

  /**
   * Simulate the mouse event.
   * @name mouseEvent
   * @summary Support: Web(WebView)
   * @param {string} eventType of the event.
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('mouseEvent', function(eventType = 'mouseover') {
    eventType = eventType.toLowerCase();
    const uuid = Date.now();
    const script = `
      var _element_${uuid} = window.__macaca_current_element;
      var event_${uuid} = document.createEvent('MouseEvent');
      event_${uuid}.initUIEvent('${eventType}', true, true);
      _element_${uuid}.dispatchEvent(event_${uuid});
    `;
    return this
      .execute(script)
      .sleep(100);
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

  const webpackDevServerPort = options.port || 8080;

  const BASE_URL = `http://127.0.0.1:${webpackDevServerPort}`;

  return {
    driver,
    BASE_URL,
    webpackDevServerPort
  };
};

module.exports.extendsMixIn = extendsMixIn;
