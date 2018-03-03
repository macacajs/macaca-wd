'use strict';

const assert = require('assert');

const wd = require('../lib/macaca-wd.js');

describe('test', function() {
  it('should be ok', function() {
    assert.ok(wd);
  });
});
