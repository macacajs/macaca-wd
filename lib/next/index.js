'use strict';

module.exports = wd => {
  [
    'fileChooser'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'mouse',
    'keyboard',
    'waitForSelector',
    'boundingBox'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [type, ...args] = params;
      return this.next(method, [{ type, args }]);
    });
  });
};
