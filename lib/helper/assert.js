'use strict';

const { assert } = require('chai');

const shouldContains = (...substrs) => str => {
  substrs.forEach(substr => assert.include(str, substr));
};

module.exports = wd => {
  /**
   * Check if element has pointed text.
   * @function hasText
   * @summary Support: Web(WebView)
   * @param {string} text content.
   * @type assert
   * @return {Promise.<boolean>}
   */
  wd.addElementPromiseChainMethod('hasText', function(...texts) {
    return this.text().then(shouldContains(...texts));
  });

  /**
   * Check if element is existed.
   * @function hasElementByCss
   * @summary Support: Web(WebView)
   * @param {string} text content.
   * @type assert
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('hasElementByCss', function(cssSelector) {
    return this.elementByCssIfExists(cssSelector).then(d => {
      if (!d) {
        throw new Error(`Element ${cssSelector} should be existed.`);
      }
    });
  });

  /**
   * Check if title exists.
   * @function assertTitle
   * @summary Support: Web(WebView)
   * @param {string} title - title of the web page.
   * @type assert
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('assertTitle', function(title) {
    return this.title().then(realTitle => {
      assert(
        title === realTitle,
        `expect title to be '${title}' but got ${realTitle}`
      );
    });
  });

  /**
   * Check if element's attribute right.
   * @function assertAttribute
   * @summary Support: Web(WebView)
   * @param {string} attribute - attribute's name.
   * @param {string} value - expected value.
   * @type assert
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('assertAttribute', function(attribute, value) {
    return this.execute(
      `return window.__macaca_current_element.getAttribute('${attribute}')`
    ).then(realValue => {
      assert(
        value === realValue,
        `expect attribute ${attribute} to be '${value}' but got '${realValue}'`
      );
    });
  });
};
