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
  closeFile: true
});

const cwd = process.cwd();

module.exports = wd => {
  /**
   * Generate the coverage reporter.
   * @function coverage
   * @summary Support: Web(WebView)
   * @type utility
   * @returns {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('coverage', function(context) {
    const tempDir = path.join(cwd, 'coverage', '.temp');
    _.mkdir(tempDir);
    return this.execute('return window.__coverage__')
      .then(__coverage__ => {
        if (!__coverage__) {
          return this.execute('return location.href').then(url => {
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
};
