'use strict';

const path = require('path');
const _ = require('xutil');
const { opn, platform, isExistedFile } = _;

const cwd = process.cwd();

module.exports = wd => {

  /**
   * Open all reporters in browser.
   * @function openReporter
   * @summary Support: Web(WebView)
   * @param {boolean} if open.
   * @type utility
   * @return {Promise.<boolean>}
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
};
