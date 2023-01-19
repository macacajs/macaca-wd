# touch

* Apply touch actions on devices.
* @summary Support: iOS, Android
* @see {@link https://w3c.github.io/webdriver/#actions|POST /session/:sessionId/actions}
* @param {string} action Name of the action, tap/doubleTap/press/pinch/rotate/drag.
* @param [object] args Parameters of the action {@link https://github.com/alibaba/macaca/issues/366 more params}
* @example driver.touch('doubleTap', {x: 100, y: 100});
