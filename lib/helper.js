'use strict';

const _ = require('xutil');
const Promise = require('bluebird');
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

const extendsMixIn = wd => {
  wd.addPromiseChainMethod('initWindow', function(options = {}) {
    return this
      .init(Object.assign({
        platformName: 'desktop',
        browserName: 'electron',
        deviceScaleFactor: 2
      }, options))
      .setWindowSize(options.width, options.height);
  });

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
        collector.add(__coverage__);
        reporter.addAll([
          'html',
          'lcov'
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

  wd.addPromiseChainMethod('formatInput', function(cssSelector, string) {
    const uuid = Date.now();
    const input = `document.querySelector('${cssSelector}')`;
    const eventHandle = `
      var event_${uuid} = document.createEvent('Event');
      event_${uuid}.initEvent('input', true, true);
      _element_${uuid}.dispatchEvent(event_${uuid});
    `;
    const list = Array.prototype.slice.call(string);

    if (!list.length) {
      return this;
    }
    let value = list[0];

    if (list.length === 1) {
      const script = `
        var _element_${uuid} = ${input};
        _element_${uuid}.value='${value}';
        ${eventHandle}
      `;
      return this
        .execute(script)
        .sleep(100);
    }

    return Promise.reduce(list, (i, item) => {
      value += item;
      const script = `
        var _element_${uuid} = ${input};
        _element_${uuid}.value='${value}';
        ${eventHandle}
      `;
      return this
        .execute(script)
        .sleep(100);
    });
  });

  wd.addPromiseChainMethod('elementTouch', function(cssSelector, options) {
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
    const element = `document.querySelector('${cssSelector}')`;
    const script = `
      var _element_${uuid} = ${element};
      var _config_${uuid} = ${JSON.stringify(config)};
      _config_${uuid}.target = _element_${uuid};
      ${eventHandle}
    `;
    return this
      .execute(script)
      .sleep(100);
  });

  wd.addPromiseChainMethod('keyboardEvent', function(cssSelector, eventType = 'keydown', keyCode = 13) {
    // TODO
    // HTMLEvents
    eventType = eventType.toLowerCase();
    const uuid = Date.now();
    const element = `document.querySelector('${cssSelector}')`;
    const script = `
      var _element_${uuid} = ${element};
      var event_${uuid} = document.createEvent('UIEvents');
      event_${uuid}.initUIEvent('${eventType}', true, true, window, 0);
      event_${uuid}.keyCode = ${keyCode};
      _element_${uuid}.dispatchEvent(event_${uuid});
    `;
    return this
      .execute(script)
      .sleep(100);
  });

  wd.addPromiseChainMethod('mouseEvent', function(cssSelector, eventType = 'mouseover') {
    eventType = eventType.toLowerCase();
    const uuid = Date.now();
    const element = `document.querySelector('${cssSelector}')`;
    const script = `
      var _element_${uuid} = ${element};
      var event_${uuid} = document.createEvent('MouseEvent');
      event_${uuid}.initUIEvent('${eventType}', true, true);
      _element_${uuid}.dispatchEvent(event_${uuid});
    `;
    return this
      .execute(script)
      .sleep(100);
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
