'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('xutil');
const program = require('commander');

program
  .allowUnknownOption()
  .option('--coverage-ignore [coverageIgnore]', 'ignore RegExp for coverage ')
  .parse(process.argv);

const xlogger = require('xlogger');

const logger = xlogger.Logger({
  closeFile: true,
});

const cwd = process.cwd();

module.exports = wd => {
  /**
   * Generate the coverage reporter.
   * @function coverage
   * @summary Support: Web(WebView)
   * @type utility
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('coverage', function(opts = {}) {
    let {
      coverageIgnore = program.coverageIgnore,
      keys = [],
      coverageHandler,
    } = opts;
    const tempDir = path.join(cwd, 'coverage', '.temp');
    _.mkdir(tempDir);
    return this.execute('return { allKeys: Object.keys(window.__coverage__) }')
      .then(async res => {
        const { allKeys } = res;
        if (!keys.length && allKeys) {
          keys = allKeys;
        }
        if (coverageIgnore) {
          logger.info('handle coverageIgnore');
          const ignoreReg = new RegExp(coverageIgnore, 'i');
          keys = keys.filter(k => {
            return !ignoreReg.test(k);
          });
        }
        if (!keys.length) {
          logger.info('coverage keys is empty');
          return;
        }
        const covFile = path.join(tempDir, `${+new Date()}_coverage.json`);
        const writer = fs.createWriteStream(covFile);
        writer.write('{');
        for (let i = 0; i < keys.length; i++) {
          const coverage = await this.execute(`return window.__coverage__['${keys[i]}']`);
          if (coverage) {
            const coverageJSON = JSON.stringify(coverage);
            let covChunk;
            if (coverageHandler) {
              covChunk = await coverageHandler(keys[i], coverageJSON);
            }
            writer.write(covChunk || `"${keys[i]}":${coverageJSON}`);
            if (i < keys.length - 1) {
              writer.write(',');
            }
          }
        }
        writer.write('}');
        await new Promise(resolve => {
          writer.end(() => {
            writer.close();
            resolve();
          });
        });
      });
  });
};
