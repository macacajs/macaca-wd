'use strict';

const _ = require('./lodash');
const __slice = Array.prototype.slice;
const utils = require('./utils');
const deprecator = utils.deprecator;

function Asserter(_assert) {
  this.assert = _assert;
}

/**
 * asserters.nonEmptyText
 *
 * @asserter
 */
const nonEmptyText = new Asserter(
  function(target, cb) {
    target.text(function(err, text) {
      if (err) { return cb(err); }
      const satisfied = text && _(text).trim().value().length > 0;
      cb(null, satisfied, satisfied ? text : undefined);
    });
  }
);

/**
 * asserters.textInclude(content) -> Asserter
 *
 * @param content
 * @asserter
 */
function textInclude(content) {
  return new Asserter(
    function(target, cb) {
      target.text(function(err, text) {
        if (err) { return cb(err); }
        const satisfied = text && _(text).includeString(content).value();
        cb(null, satisfied, satisfied ? text : undefined);
      });
    }
  );
}

/**
 * asserters.isVisible
 *
 * @asserter
 */
const isDisplayed = new Asserter(
  function(el, cb) {
    el.isDisplayed(function(err, displayed) {
      if (err) { return cb(err); }
      cb(null, displayed);
    });
  }
);
const isVisible = new Asserter(
  function() {
    deprecator.warn('isVisible asserter', 'isVisible asserter has been deprecated, use isDisplayed asserter instead.');
    const args = __slice.call(arguments, 0);
    isDisplayed.assert.apply(this, args);
  }
);

/**
 * asserters.isHidden
 *
 * @asserter
 */
const isNotDisplayed = new Asserter(
  function(el, cb) {
    el.isDisplayed(function(err, displayed) {
      if (err) { return cb(err); }
      cb(null, !displayed);
    });
  }
);
const isHidden = new Asserter(
  function() {
    deprecator.warn('isHidden asserter', 'isHidden asserter has been deprecated, use isNotDisplayed asserter instead.');
    const args = __slice.call(arguments, 0);
    isNotDisplayed.assert.apply(this, args);
  }
);

/**
 * asserters.jsCondition(jsConditionExpr) -> Asserter
 * jsConditionExpr: js script expression, should evaluate as boolean.
 *
 * @param jsConditionExpr
 * @param safe
 * @asserter
 */
function jsCondition(jsConditionExpr, safe) {
  // jshint evil: true
  if (safe === undefined) { safe = false; }
  return new Asserter(
    function(browser, cb) {
      const _eval = safe ? browser.safeEval : browser.eval;
      _eval.apply(browser, [ jsConditionExpr, function(err, res) {
        if (err) { return cb(err); }
        cb(null, res, res);
      } ]);
    }
  );
}

module.exports = {
  Asserter,
  nonEmptyText,
  isDisplayed,
  isNotDisplayed,
  textInclude,
  jsCondition,
  // deprecated
  isVisible,
  isHidden,
};
