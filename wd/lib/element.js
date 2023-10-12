'use strict';

// Element object
// Wrapper around browser methods
const __slice = Array.prototype.slice;
const _ = require('./lodash');
const utils = require('./utils.js');
const niceArgs = utils.niceArgs;
const niceResp = utils.niceResp;
const elementCommands = require('./element-commands');

const Element = function(value, browser) {
  this.value = value;
  this.browser = browser;

  if (!value) {
    throw new Error('no value passed to Element constructor');
  }

  if (!browser) {
    throw new Error('no browser passed to Element constructor');
  }
};

Element.prototype.emit = function() {
  this.browser.emit.apply(this.browser, __slice.call(arguments, 0));
};

Element.prototype.toString = function() {
  return String(this.value);
};

Element.prototype.toJSON = function() {
  return { ELEMENT: this.value };
};

_(elementCommands).each(function(fn, name) {
  Element.prototype[name] = function() {
    const _this = this;
    const fargs = utils.varargs(arguments);
    this.emit('command', 'CALL', 'element.' + name + niceArgs(fargs.all));
    const cb = function(err) {
      if (err) {
        err.message = '[element.' + name + niceArgs(fargs.all) + '] ' + err.message;
        fargs.callback(err);
      } else {
        const cbArgs = __slice.call(arguments, 0);
        _this.emit('command', 'RESPONSE', 'element.' + name + niceArgs(fargs.all),
          niceResp(_.rest(cbArgs)));
        fargs.callback.apply(null, cbArgs);
      }
    };
    const args = fargs.all.concat([ cb ]);
    return fn.apply(this, args);
  };
}).value();

module.exports = Element;
