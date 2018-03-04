'use strict';

const _ = require('xutil');
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

const cwd = process.cwd();

const DataHubClient = require('datahub-nodejs-sdk');

const datahubClient = new DataHubClient();

const extendsMixIn = wd => {
  wd.addPromiseChainMethod('initWindow', function (options = {}) {
    return this
      .init(Object.assign({
        platformName: 'desktop',
        browserName: 'electron',
        deviceScaleFactor: 2
      }, options))
      .setWindowSize(options.width, options.height);
  });

  wd.addPromiseChainMethod('getUrl', function (url) {
    return this
      .get(url)
      .execute('return location.protocol')
      .then(protocol => {
        if (protocol !== 'http:') {
          return new Promise(resolve => {
            const handle = () => {
              setTimeout(() => {
                this
                  .get(url)
                  .execute('return location.protocol')
                  .then(protocol => {
                    if (protocol === 'http:') {
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

  wd.addPromiseChainMethod('saveScreenshots', function (context) {
    const filepath = path.join(cwd, 'screenshots', `${uuid()}.png`);
    const reportspath = path.join(cwd, 'reports');
    mkdir(path.dirname(filepath));

    return this
      .saveScreenshot(filepath)
      .then(() => {
        appendToContext(context, `${path.relative(reportspath, filepath)}`);
      });
  });

  wd.addPromiseChainMethod('coverage', function (context) {
    const coverageHtml = path.join(cwd, 'coverage', 'index.html');
    return this
      .execute('return window.__coverage__')
      .then(__coverage__ => {
        if (!__coverage__) {
          return this
            .execute('return location.href')
            .then(url => {
              console.log(`>> coverage failed: ${url}`);
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
            console.log(`>> coverage: ${coverageHtml}`);
            resolve('ok');
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  });

  wd.addPromiseChainMethod('openReporter', function (open) {
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

  wd.addPromiseChainMethod('switchScene', function ({
    hub: projectId,
    pathname,
    scene = 'default',
    delay = '0',
    status: statusCode = '200',
    headers: responseHeaders = {},
  }) {
    return datahubClient.updateSceneByProjectIdAndDataId(projectId, pathname, {
      currentScene: scene,
      delay,
      statusCode,
      responseHeaders,
    });
  });

  wd.addPromiseChainMethod('switchAllScenes', function ({
    hub: projectId,
    scene = 'default',
    delay = '0',
    status: statusCode = '200',
    headers: responseHeaders = {},
  }) {
    return datahubClient
      .getDataListByProjectId(projectId)
      .then(dataList => {
        if (!(dataList.success && Array.isArray(dataList.data))) {
          throw new Error('switch all scenes failed')
        }
        const dataIdList = dataList.data.map(item => item.pathname)
        return Promise.all(dataIdList.map(pathname => {
          return datahubClient
            .updateSceneByProjectIdAndDataId(projectId, pathname, {
              currentScene: scene,
              delay,
              statusCode,
              responseHeaders,
            });
        }));
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
    webpackDevServerPort,
  };
};

module.exports.extendsMixIn = extendsMixIn;
