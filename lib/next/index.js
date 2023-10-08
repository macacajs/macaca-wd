'use strict';

module.exports = wd => {
  [
    'page',
    'popup'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'elementStatus'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'fileChooser'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'mouse',
    'keyboard'
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [type, ...args] = params;
      return this.next(method, [{ type, args }]);
    });
  });
};
