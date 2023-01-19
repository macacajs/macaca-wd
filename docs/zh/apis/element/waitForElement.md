# waitForElement

* All the element-related methods above (except which suffixed with OrNull, IfExists) could be prefixed with the "waitFor-" (need to capitalize the 'e', e.g., waitForElementByCss)
* @summary Support: Android iOS Web(WebView)
* @param {string} using The locator strategy to use, omitted when using specific method like waitForElementByCss.
* @param {string} value The css selector
* @param {function} [asserter] The asserter function (commonly used asserter function can be found at wd.asserters) (optional)
* @param {number} [timeout=1000ms] The timeout before find the element (optional)
* @param {number} [interval=200ms] The interval between each searching (optional)
* @example waitForElementByCss('btn', 2000, 100) Search for element which class name is 'btn' at intervals of 100ms, last for 2000ms.
