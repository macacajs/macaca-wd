'use strict';

const extendsMixIn = wd => {
  require('../next')(wd);
  require('./element')(wd);
  require('./assert')(wd);
  require('./macaca-datahub')(wd);
  require('./coverage')(wd);
  require('./reporter')(wd);
  require('macaca-ai-engine/lib/wd-mixin')(wd);
};

function initDriverServer(wd, options = {}) {
  extendsMixIn(wd);

  const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: options.macacaServerPort || process.env.MACACA_SERVER_PORT || 3456,
  });

  driver.configureHttp({
    timeout: 20E3,
    retries: 5,
    retryDelay: 5,
  });

  const webpackDevServerPort = options.port || 8080;

  const BASE_URL = `http://127.0.0.1:${webpackDevServerPort}`;

  return {
    driver,
    BASE_URL,
    webpackDevServerPort,
  };
}

module.exports = initDriverServer;
module.exports.extendsMixIn = extendsMixIn;
