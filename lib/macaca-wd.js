'use strict';

/**
 * Query the server's current status.
 * @summary Support: Android iOS Web(WebView)
 * @returns {Promise.<Object>} The server's current status.
 */
function status() {}

/**
 * Create a new session.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-new-session|POST /session}
 * @param {Object} desired Desired Capabilities
 * @returns {Promise.<Object>}
 */
function init(desired) {}

/**
 * Returns a list of the currently active sessions.
 * @summary Support: Android iOS Web(WebView)
 * @returns {Promise.<Array>}
 */
function sessions() {}

/**
 * Delete the session.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-delete-session|DELETE /session/:sessionId}
 * @returns {Promise}
 */
function quit() {}

/**
 * Get the current context.
 * @summary Support: Android iOS
 * @returns {Promise.<string>}
 */
function currentContext() {}

/**
 * Set the current context.
 * @summary Support: Android iOS
 * @param {string} contextRef context reference from contexts
 * @returns {Promise}
 */
function context(contextRef) {}

/**
 * Get a list of the available contexts.
 * @summary Support: Android iOS
 * @returns {Promise.<Array>} A list of available contexts.
 */
function contexts() {}

/**
 * Set the amount of time the driver should wait.
 * @summary Support: Android iOS Web(WebView)
 * @param {number} ms The amount of time to wait, in milliseconds
 * @returns {Promise}
 */
function sleep(ms) {}

/**
 * Take a screenshot of the current page.
 * @summary Support: Android iOS Web(WebView)
 * @returns {Promise.<string>} The screenshot as a base64 encoded PNG.
 */
function takeScreenshot() {}

/**
 * Save the screenshot of the current page.
 * @summary Support: Android iOS Web(WebView)
 * @param {str} filepath The path to save the screenshot or left blank (will create a file in the system temp dir).
 * @returns {Promise.<string>} The filepath of the screenshot.
 */
function saveScreenshot(filepath) {}

/**
 * Get the current page source.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-get-page-source|GET 	/session/:sessionId/source}
 * @returns {Promise.<string>}
 */
function source() {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @returns {Promise.<Element>}
 */
function element(using, value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The class name
 * @returns {Promise.<Element>}
 */
function elementByClassName(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element>}
 */
function elementByCssSelector(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The ID attribute
 * @returns {Promise.<Element>}
 */
function elementById(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The name attribute
 * @returns {Promise.<Element>}
 */
function elementByName(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The text
 * @returns {Promise.<Element>}
 */
function elementByLinkText(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The partially text
 * @returns {Promise.<Element>}
 */
function elementByPartialLinkText(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The tag name
 * @returns {Promise.<Element>}
 */
function elementByTagName(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The XPath expression
 * @returns {Promise.<Element>}
 */
function elementByXPath(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element>}
 */
function elementByCss(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @returns {Promise.<Array>}
 */
function elements(using, value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The class name
 * @returns {Promise.<Array>}
 */
function elementsByClassName(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The css selector
 * @returns {Promise.<Array>}
 */
function elementsByCssSelector(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The ID attribute
 * @returns {Promise.<Array>}
 */
function elementsById(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The name attribute
 * @returns {Promise.<Array>}
 */
function elementsByName(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The text
 * @returns {Promise.<Array>}
 */
function elementsByLinkText(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The partially text
 * @returns {Promise.<Array>}
 */
function elementsByPartialLinkText(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The tag name
 * @returns {Promise.<Array>}
 */
function elementsByTagName(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The XPath expression
 * @returns {Promise.<Array>}
 */
function elementsByXPath(value) {}

/**
 * Search for multiple elements on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/elements}
 * @param {string} value The css selector
 * @returns {Promise.<Array>}
 */
function elementsByCss(value) {}

/**
 * All the element-related methods above (except which suffixed with OrNull, IfExists) could be prefixed with the "waitFor-" (need to capitalize the 'e', e.g., waitForElementByClassName)
 * @summary Support: Android iOS Web(WebView)
 * @param {string} using The locator strategy to use, omitted when using specific method like waitForElementByClassName.
 * @param {string} value The css selector
 * @param {function} [asserter] The asserter function (commonly used asserter function can be found at wd.asserters) (optional)
 * @param {number} [timeout=1000ms] The timeout before find the element (optional)
 * @param {number} [interval=200ms] The interval between each searching (optional)
 * @example waitForElementByClassName('btn', 2000, 100) Search for element which class name is 'btn' at intervals of 100ms, last for 2000ms.
 * @returns {Promise.<Array>}
 */
function waitForElement(using, value, asserter, timeout, interval) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @returns {Promise.<Element|null>}
 */
function elementOrNull(using, value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The class name
 * @returns {Promise.<Element|null>}
 */
function elementByClassNameOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element|null>}
 */
function elementByCssSelectorOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The ID attribute
 * @returns {Promise.<Element|null>}
 */
function elementByIdOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The name attribute
 * @returns {Promise.<Element|null>}
 */
function elementByNameOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The text
 * @returns {Promise.<Element|null>}
 */
function elementByLinkTextOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The partially text
 * @returns {Promise.<Element|null>}
 */
function elementByPartialLinkTextOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The tag name
 * @returns {Promise.<Element|null>}
 */
function elementByTagNameOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The XPath expression
 * @returns {Promise.<Element|null>}
 */
function elementByXPathOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element|null>}
 */
function elementByCssOrNull(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @returns {Promise.<Element|null>}
 */
function elementIfExists(using, value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The class name
 * @returns {Promise.<Element|undefined>}
 */
function elementByClassNameIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element|undefined>}
 */
function elementByCssSelectorIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The ID attribute
 * @returns {Promise.<Element|undefined>}
 */
function elementByIdIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The name attribute
 * @returns {Promise.<Element|undefined>}
 */
function elementByNameIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The text
 * @returns {Promise.<Element|undefined>}
 */
function elementByLinkTextIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The partially text
 * @returns {Promise.<Element|undefined>}
 */
function elementByPartialLinkTextIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The tag name
 * @returns {Promise.<Element|undefined>}
 */
function elementByTagNameIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The XPath expression
 * @returns {Promise.<Element|undefined>}
 */
function elementByXPathIfExists(value) {}

/**
 * Search for an element on the page, starting from the document root.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<Element|undefined>}
 */
function elementByCssIfExists(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @returns {Promise.<boolean>}
 */
function hasElement(using, value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The class name.
 * @returns {Promise.<boolean>}
 */
function hasElementByClassName(value) {}

/**
 * Check if element exists.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector.
 * @returns {Promise.<boolean>}
 */
function hasElementByCssSelector(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The ID attribute.
 * @returns {Promise.<boolean>}
 */
function hasElementById(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The name attribute.
 * @returns {Promise.<boolean>}
 */
function hasElementByName(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The text
 * @returns {Promise.<boolean>}
 */
function hasElementByLinkText(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The partially text
 * @returns {Promise.<boolean>}
 */
function hasElementByPartialLinkText(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The tag name
 * @returns {Promise.<boolean>}
 */
function hasElementByTagName(value) {}

/**
 * Check if element exists.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The XPath expression
 * @returns {Promise.<boolean>}
 */
function hasElementByXPath(value) {}

/**
 * Check if element exists.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#elements|POST /session/:sessionId/element}
 * @param {string} value The css selector
 * @returns {Promise.<boolean>}
 */
function hasElementByCss(value) {}

/**
 * Click on an element.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-element-click|POST /session/:sessionId/element/:id/click}
 * @returns {Promise}
 */
function click() {}

/**
 * Send a sequence of key strokes to the active element.
 * @summary Support: Android iOS Web(WebView)
 * @param {string} keys The keys sequence to be sent.
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-element-send-keys|POST /session/:sessionId/element/:id/sendKeys}
 * @returns {Promise}
 */
function sendKeys(keys) {}

/**
 * Send a sequence of key strokes to the active window.
 * @summary Support: Android Web(WebView) More: https://github.com/alibaba/macaca/issues/487
 * @param {string} keys The keys sequence to be sent.
 * @returns {Promise}
 */
function keys(keys) {}

/**
 * Returns the visible text for the element.
 * @summary Support: Android iOS Web(WebView)
 * @returns {Promise.<string>}
 */
function text() {}

/**
 * Clear a TEXTAREA or text INPUT element's value.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#element-clear|POST /session/:sessionId/element/:id/clear}
 * @returns {Promise.<string>}
 */
function clear() {}

/**
 * Determine if an element is currently displayed.
 * @summary Support: Android Web(WebView)
 * @returns {Promise.<string>}
 */
function isDisplayed() {}

/**
 * Get the result of a property of a element.
 * @summary Support: Android iOS Web(WebView). iOS: 'isVisible', 'isAccessible', 'isEnabled', 'type', 'label', 'name', 'value', Android: 'selected', 'description', 'text'
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-get-element-property|GET /session/:sessionId/element/:id/property/:name}
 * @param {string} name The property name
 * @returns {Promise.<string>}
 */
function getProperty(name) {}

/**
 * Query the value of an element's computed CSS property.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get-element-css-value|GET /session/:sessionId/element/:id/css/:propertyName}
 * @param {string} propertyName The property name
 * @returns {Promise.<string>}
 */
function getComputedCss(propertyName) {}

/**
 * Get the dimensions and coordinates of the given element with a object including x/y/height/width.
 * @summary Support: Android iOS.
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-get-element-rect|GET /session/:sessionId/element/:id/rect}
 * @returns {Promise.<string>}
 */
function getRect() {}

/**
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#executing-script|POST /session/:sessionId/execute}
 * @param code script
 * @param [args] script argument array
 * @returns {Promise.<string>}
 */
function execute() {}

/**
 * Get the current page title.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#accept-alert|GET /session/:sessionId/title}
 * @returns {Promise.<string>}
 */
function title() {}

/**
 * Accepts the currently displayed alert dialog.
 * @summary Support: Android iOS
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#accept-alert|POST /session/:sessionId/accept_alert}
 * @returns {Promise.<string>}
 */
function acceptAlert() {}

/**
 * Dismisses the currently displayed alert dialog.
 * @summary Support: Android iOS
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dismiss-alert|POST /session/:sessionId/dismiss_alert}
 * @returns {Promise.<string>}
 */
function dismissAlert() {}

/**
 * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
 * @summary Support: iOS
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#send-alert-text|GET /session/:sessionId/alert_text}
 * @returns {Promise.<string>}
 */
function alertText() {}

/**
 * Sends keystrokes to a JavaScript prompt() dialog.
 * @summary Support: iOS
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#send-alert-text|POST /session/:sessionId/alert_text}
 * @param keys
 * @returns {Promise.<string>}
 */
function alertKeys() {}

/**
 * Retrieve the URL of the current page.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get-current-url|GET /session/:sessionId/url}
 * @returns {Promise.<string>}
 */
function url() {}

/**
 * Navigate to a new URL.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get|POST /session/:sessionId/url}
 * @param url get a new url.
 * @returns {Promise.<string>}
 */
function get() {}

/**
 * Navigate forwards in the browser history, if possible.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#back|POST /session/:sessionId/forward}
 * @returns {Promise.<string>}
 */
function forward() {}

/**
 * Navigate backwards in the browser history, if possible.
 * @summary Support: Android Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#back|POST /session/:sessionId/back}
 * @returns {Promise.<string>}
 */
function back() {}

/**
 * Refresh the current page.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#refresh|POST /session/:sessionId/refresh}
 * @returns {Promise.<string>}
 */
function refresh() {}

/**
 * Change focus to another window.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#switch-to-window|POST /session/:sessionId/window}
 * @returns {Promise.<string>}
 */
function window() {}

/**
 * Close the current window.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#close-window|DELETE /session/:sessionId/window}
 * @returns {Promise.<string>}
 */
function close() {}

/**
 * Retrieve the current window handle.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get-window-handle|GET /session/:sessionId/window_handle}
 * @returns {Promise.<string>}
 */
function windowHandle() {}

/**
 * Retrieve the list of all window handles available to the session.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get-window-handles|GET /session/:sessionId/window_handles}
 * @returns {Promise.<string>}
 */
function windowHandles() {}

/**
 * Get the size of the specified window.
 * @summary Support: Android iOS Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#get-window-size|GET /session/:sessionId/window/size}
 * @param [handle] window handle to set size for (optional, default: 'current')
 * @returns {Promise.<string>}
 */
function getWindowSize() {}

/**
 * Change the size of the specified window.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#set-window-size|POST	/session/:sessionId/window/size}
 * @param width width in pixels to set size to
 * @param height height in pixels to set size to
 * @param [handle] window handle to set size for (optional, default: 'current')
 * @returns {Promise.<string>}
 */
function setWindowSize() {}

/**
 * Maximize the specified window if not already maximized.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#dfn-maximize-window|POST /session/:sessionId/window/maximize}
 * @param handle window handle
 * @returns {Promise.<string>}
 */
function maximize() {}

/**
 * Change focus to another frame on the page.
 * @summary Support: Web(WebView)
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#switch-to-frame|POST /session/:sessionId/frame}
 * @param {string|number|null} frameRef Identifier(id/name) for the frame to change focus to
 * @returns {Promise.<string>}
 */
function frame(frameRef) {}

/**
 * Apply touch actions on devices.
 * @summary Support: iOS, Android
 * @see {@link https://w3c.github.io/webdriver/webdriver-spec.html#actions|POST /session/:sessionId/actions}
 * @param {string} action Name of the action, tap/doubleTap/press/pinch/rotate/drag.
 * @param [object] args Parameters of the action {@link https://github.com/alibaba/macaca/issues/366 more params}
 * @example driver.touch('doubleTap', {x: 100, y: 100});
 * @returns {Promise.<string>}
 */
function touch(action, args) {}

Object.defineProperty(module, "exports", {
  get: function() {
    var main = '../wd/lib/main';
    delete require.cache[require.resolve(main)]
    var instance = require(main);
    return instance;
  }
});
