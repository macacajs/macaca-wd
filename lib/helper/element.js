'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('xutil');
const Promise = require('bluebird');
const { uuid, mkdir } = _;
const { appendToContext } = require('macaca-reporter');
const domEventLib = require.resolve('dom-event-simulate');
const domEventLibSource = fs.readFileSync(domEventLib, 'utf8');

const cwd = process.cwd();
const reporterDir = process.env.MACACA_REPORTER_DIR || cwd;
const reportsPath = path.join(reporterDir, 'reports');

const safeQuote = string => JSON.stringify(String(string));

module.exports = wd => {
  /**
   * Initial browser window.
   * @function initWindow
   * @summary Support: Web(WebView)
   * @param {object} browser options.
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('initWindow', function(options = {}) {
    return this.init({
      platformName: 'playwright',
      browserName: 'chromium',
      deviceScaleFactor: 2,
      viewport: {
        width: options.width,
        height: options.height,
      },
      ...options,
    });
  });

  /**
   * Get webpage from url util the page ready.
   * @function getUrl
   * @summary Support: Web(WebView)
   * @param {string} the pointed url.
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('getUrl', function(url) {
    return this
      .get(url)
      .execute('return location.protocol')
      .then(protocol => {
        // eslint-disable-next-line no-bitwise
        if (!~[ 'http:', 'https:' ].indexOf(protocol)) {
          return new Promise(resolve => {
            const handle = () => {
              setTimeout(() => {
                this.get(url)
                  .execute('return location.protocol')
                  .then(protocol => {
                    // eslint-disable-next-line no-bitwise
                    if (~[ 'http:', 'https:' ].indexOf(protocol)) {
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

  /**
   * Save screenshots to ./screenshots.
   * @function saveScreenshots
   * @summary Support: Web(WebView)
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('saveScreenshots', function(context, params) {
    const filepath = path.join(reportsPath, 'screenshots', `${uuid()}.png`);
    mkdir(path.dirname(filepath));

    return this.saveScreenshot(filepath, params).then(() => {
      appendToContext(context, `${path.relative(reportsPath, filepath)}`);
    });
  });

  /**
   * Save videos to ./screenshots.
   * @function saveVideos
   * @summary Support: Web(WebView)
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('saveVideos', function(context, params = {}) {
    params.video = true;
    return this.saveScreenshot(null, params).then(filepath => {
      appendToContext(context, `${path.relative(reportsPath, filepath)}`);
    });
  });

  /**
   * Type content to input element.
   * @function formInput
   * @summary Support: Web(WebView)
   * @param {string} content of type.
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('formInput', function(string) {
    const list = Array.prototype.slice.call(string);

    if (!list.length) {
      return this;
    }

    let value = '';

    return Promise.each(list, item => {
      value += item;
      const script = `
      (function() {
        var element = window.__macaca_current_element;
        var setValue = Object.getOwnPropertyDescriptor(
          window[element.constructor.name].prototype,
          'value'
        ).set;
        setValue.call(element, ${safeQuote(value)});
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        element.dispatchEvent(event);
      })()
      `;
      return this.execute(script).sleep(10);
    });
  });

  /**
   * Type content to a contentEditable element.
   * @function elementInput
   * @summary Support: Web(WebView)
   * @param {string} content of type.
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('elementInput', function(string) {
    const list = Array.prototype.slice.call(string);

    if (!list.length) {
      return this;
    }

    let value = '';

    return Promise.each(list, item => {
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
      return this.execute(script).sleep(10);
    });
  });

  /**
   * Simulate the dom event.
   * @function domEvent
   * @summary Support: Web(WebView)
   * @param {string} eventType - type of the event.
   * @param {object} options - options of the event.
   * @see https://github.com/macacajs/dom-event-simulate#support-events
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('domEvent', function(eventName, options) {
    const uuid = Date.now();
    const script = `
      ${domEventLibSource}
      var _element_${uuid} = window.__macaca_current_element;
      _macaca_simulate.domEvent(_element_${uuid}, '${eventName}', ${JSON.stringify(
  options
)});
    `;
    return this.execute(script);
  });
};
