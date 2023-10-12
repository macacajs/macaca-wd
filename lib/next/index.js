

module.exports = wd => {
  [
    'page',
    'pagePopup',
    'browser',
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [ func, ...args ] = params;
      return this.next(method, [{ func, args }]);
    });
  });

  [
    'fileChooser',
    'elementStatus',
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      return this.next(method, params);
    });
  });

  [
    'mouse',
    'keyboard',
  ].map(method => {
    wd.addPromiseChainMethod(method, function(...params) {
      const [ type, ...args ] = params;
      return this.next(method, [{ type, args }]);
    });
  });
};
