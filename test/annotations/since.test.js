/* global describe, it */
'use strict';

var assert = require('assert');

describe('#since', function () {
  var since = require('../../src/annotation').since;

  it('should return an object', function () {
    assert.deepEqual(since.parse('   '), {});
    assert.deepEqual(since.parse('1.5.7'), { version: '1.5.7' });
    assert.deepEqual(since.parse('1.5.7 - here is a description'), { version: '1.5.7', description: 'here is a description' });
  });
});
