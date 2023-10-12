'use strict';

const _ = require('./lodash');

const httpConfig = {
  timeout: undefined,
  retries: 3,
  retryDelay: 15,
  baseUrl: undefined,
  proxy: undefined,
};

function _configureHttp(httpConfig, opts) {
  _(_.keys(httpConfig)).intersection(_.keys(opts)).each(function(key) {
    switch (key) {
      case 'timeout':
        if (opts[key] === 'default') { opts[key] = undefined; }
        break;
      case 'retries':
        if (opts[key] === 'always') { opts[key] = 0; }
        if (opts[key] === 'never') { opts[key] = -1; }
        break;
      default:
        break;
    }
    httpConfig[key] = opts[key];
  }, this)
    .value();
}

function configureHttp(opts) {
  _configureHttp(httpConfig, opts);
}

module.exports = {
  httpConfig,
  _configureHttp,
  configureHttp,
};
