'use strict';

const helper = require('./helper');
const wd = require('../wd/lib/main');

module.exports = wd;
module.exports.helper = helper;
module.exports.webpackHelper = helper(wd);
