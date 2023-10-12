'use strict';

// inspired by https://github.com/raszi/node-tmp, but only
// provides tmp paths.

const fs = require('fs');
const path = require('path');
const os = require('os');
const utils = require('./utils');

function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

function _parseArguments() {
  const fargs = utils.varargs(arguments);
  const callback = fargs.callback;
  const options = fargs.all[0];
  return [ options, callback ];
}

/**
 * Gets the temp directory.
 *
 * @return {String}
 * @api private
 */
function _getTMPDir() {
  const tmpNames = [ 'TMPDIR', 'TMP', 'TEMP' ];

  for (let i = 0, length = tmpNames.length; i < length; i++) {
    if (_isUndefined(process.env[tmpNames[i]])) { continue; }

    return process.env[tmpNames[i]];
  }

  // fallback to the default
  return '/tmp';
}

const exists = fs.exists || path.exists;
const tmpDir = os.tmpdir || _getTMPDir;
const _TMP = tmpDir();
const randomChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
const randomCharsLength = randomChars.length;

/**
 * Gets a temporary file name.
 *
 * @api private
 * @param options
 * @param callback
 */
function _getTmpName(options, callback) {
  const args = _parseArguments(options, callback);
  const opts = args[0];
  const cb = args[1];
  const template = opts.template;
  const templateDefined = !_isUndefined(template);
  let tries = opts.tries || 3;

  if (isNaN(tries) || tries < 0) { return cb(new Error('Invalid tries')); }

  if (templateDefined && !template.match(/XXXXXX/)) { return cb(new Error('Invalid template provided')); }

  function _getName() {

    // prefix and postfix
    if (!templateDefined) {
      const name = [
        (_isUndefined(opts.prefix)) ? 'tmp-' : opts.prefix,
        process.pid,
        (Math.random() * 0x1000000000).toString(36),
        opts.postfix,
      ].join('');

      return path.join(opts.dir || _TMP, name);
    }

    // mkstemps like template
    const chars = [];

    for (let i = 0; i < 6; i++) {
      chars.push(randomChars.substr(Math.floor(Math.random() * randomCharsLength), 1));
    }

    return template.replace(/XXXXXX/, chars.join(''));
  }

  (function _getUniqueName() {
    const name = _getName();

    // check whether the path exists then retry if needed
    exists(name, function _pathExists(pathExists) {
      if (pathExists) {
        if (tries-- > 0) { return _getUniqueName(); }

        return cb(new Error('Could not get a unique tmp filename, max tries reached'));
      }

      cb(null, name);
    });
  }());
}

// exporting all the needed methods
module.exports.tmpdir = _TMP;
module.exports.tmpName = _getTmpName;
