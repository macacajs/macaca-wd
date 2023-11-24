'use strict';

module.exports = wd => {
  [
    'pageIframe',
  ].forEach(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [ index, func, ...args ] = params;
      return this.next(method, [{ index, func, args }]);
    });
  });

  [
    'page',
    'pagePopup',
    'locator',
    'browser',
    'browserType',
  ].forEach(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [ func, ...args ] = params;
      return this.next(method, [{ func, args }]);
    });
  });

  [
    'fileChooser',
    'elementStatus',
  ].forEach(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'mouse',
    'keyboard',
  ].forEach(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [ type, ...args ] = params;
      return this.next(method, [{ type, args }]);
    });
  });
};
