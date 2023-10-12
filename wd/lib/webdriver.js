'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('./lodash');
const util = require('util');
const url = require('url');
const __slice = Array.prototype.slice;
const utils = require('./utils');
const findCallback = utils.findCallback;
const niceArgs = utils.niceArgs;
const niceResp = utils.niceResp;
const strip = utils.strip;
const deprecator = utils.deprecator;
const httpUtils = require('./http-utils');
const config = require('./config');
const Element = require('./element');
const commands = require('./commands');

// Webdriver client main class
// configUrl: url object constructed via url.parse
const Webdriver = module.exports = function(configUrl) {
  EventEmitter.call(this);
  this.sessionID = null;
  this.configUrl = configUrl;
  // config url without auth
  this.noAuthConfigUrl = url.parse(url.format(this.configUrl));
  delete this.noAuthConfigUrl.auth;

  this.defaultCapabilities = {
    browserName: 'firefox',
    version: '',
    javascriptEnabled: true,
    platform: 'ANY',
  };

  this._httpConfig = _.clone(config.httpConfig);
};

// inherit from EventEmitter
util.inherits(Webdriver, EventEmitter);

// creates a new element
Webdriver.prototype.newElement = function(jsonWireElement) {
  return new Element(jsonWireElement, this);
};

/**
 * attach(sessionID, cb) -> cb(err)
 * Connect to an already-active session.
 * @param sessionID
 */
Webdriver.prototype.attach = function(sessionID) {
  const cb = findCallback(arguments);
  this.sessionID = sessionID;
  if (cb) { cb(null); }
};

/**
 * detach(cb) -> cb(err)
 * Detach from the current session.
 */
Webdriver.prototype.detach = function() {
  const cb = findCallback(arguments);
  this.sessionID = null;
  if (cb) { cb(null); }
};

commands.chain = function(obj) {
  deprecator.warn('chain', 'chain api has been deprecated, use promise chain instead.');
  require('./deprecated-chain').patch(this);
  return this.chain(obj);
};

Webdriver.prototype._init = function() {
  delete this.sessionID;
  const _this = this;
  const fargs = utils.varargs(arguments);
  const cb = fargs.callback;
  const desired = fargs.all[0] || {};

  const _desired = _.clone(desired);

  if (desired.deviceName || desired.device || desired.wdNoDefaults ||
    desired['wd-no-defaults']) {
    // no default or appium caps, we dont default
    delete _desired.wdNoDefaults;
    delete _desired['wd-no-defaults'];
  } else {
    // using default
    _.defaults(_desired, this.defaultCapabilities);
  }

  // http options
  const httpOpts = httpUtils.newHttpOpts('POST', _this._httpConfig);

  const url = httpUtils.buildInitUrl(this.configUrl);

  // building request
  const data = { desiredCapabilities: _desired };

  httpUtils.emit(this, httpOpts.method, url, data);

  httpOpts.prepareToSend(url, data);

  httpUtils.requestWithRetry(httpOpts, this._httpConfig, this.emit.bind(this), function(err, res, data) {
    if (err) { return cb(err); }

    let resData;
    // retrieving session
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.status === 0) {
        _this.sessionID = jsonData.sessionId;
        resData = jsonData.value;
      }
    } catch (ignore) {
      // none
    }
    if (!_this.sessionID) {
      // attempting to retrieve the session the old way
      try {
        const locationArr = res.headers.location.replace(/\/$/, '').split('/');
        _this.sessionID = locationArr[locationArr.length - 1];
      } catch (ignore) {
        // none
      }
    }

    if (_this.sessionID) {
      _this.emit('status', '\nDriving the web on session: ' + _this.sessionID + '\n');
      if (cb) { cb(null, _this.sessionID, resData); }
    } else {
      data = strip(data);
      if (cb) {
        err = new Error('The environment you requested was unavailable.');
        err.data = data;
        return cb(err);
      }
      console.error('\x1b[31mError\x1b[0m: The environment you requested was unavailable.\n');
      console.error('\x1b[33mReason\x1b[0m:\n');
      console.error(data);
      console.error('\nFor the available values please consult the WebDriver JSONWireProtocol,');
      console.error('located at: \x1b[33mhttp://code.google.com/p/selenium/wiki/JsonWireProtocol#/session\x1b[0m');

    }
  });
};

// standard jsonwire call
Webdriver.prototype._jsonWireCall = function(opts) {
  const _this = this;

  // http options init
  const httpOpts = httpUtils.newHttpOpts(opts.method, this._httpConfig);

  const url = httpUtils.buildJsonCallUrl(this.noAuthConfigUrl, this.sessionID, opts.relPath, opts.absPath);

  // building callback
  let cb = opts.cb;
  if (opts.emit) {
    // wrapping cb if we need to emit a message
    const _cb = cb;
    cb = function() {
      const args = __slice.call(arguments, 0);
      _this.emit(opts.emit.event, opts.emit.message);
      if (_cb) { _cb.apply(_this, args); }
    };
  }

  // logging
  httpUtils.emit(this, httpOpts.method, url, opts.data);

  // writing data
  const data = opts.data || {};
  httpOpts.prepareToSend(url, data);
  // building request
  httpUtils.requestWithRetry(httpOpts, this._httpConfig, this.emit.bind(this), function(err, res, data) {
    if (err) { return cb(err); }
    data = strip(data);
    cb(null, data || '');
  });
};

_(commands).each(function(fn, name) {
  Webdriver.prototype[name] = function() {
    const _this = this;
    const fargs = utils.varargs(arguments);
    this.emit('command', 'CALL', name + niceArgs(fargs.all));
    const cb = function(err) {
      if (err) {
        err.message = '[' + name + niceArgs(fargs.all) + '] ' + err.message;
        if (fargs.callback) { fargs.callback(err); }
      } else {
        const cbArgs = __slice.call(arguments, 0);
        _this.emit('command', 'RESPONSE', name + niceArgs(fargs.all),
          niceResp(_.rest(cbArgs)));
        if (fargs.callback) { fargs.callback.apply(null, cbArgs); }
      }
    };
    const args = fargs.all.concat([ cb ]);
    return fn.apply(this, args);
  };
}).value();
