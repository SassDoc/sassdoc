/* global describe, it */
'use strict';

var assert = require('assert');

describe('#since', function () {
  var since = require('../../src/annotation').since;

  it('should return an object', function () {
    assert.deepEqual(since('   '), {});
    assert.deepEqual(since('1.5.7'), { version: '1.5.7' });
    assert.deepEqual(since('1.5.7 - here is a description'), { version: '1.5.7', description: 'here is a description' });
  });
});
