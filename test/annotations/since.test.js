/* global describe, it */
'use strict';

var assert = require('assert');

describe('#since', function () {
  var since = (new (require('../../src/annotation'))()).list.since;

  it('should return an object', function () {
    assert.deepEqual(since.parse('   '), {});
    assert.deepEqual(since.parse('1.5.7'), { version: '1.5.7' });
    assert.deepEqual(since.parse('1.5.7 - here is a description'), { version: '1.5.7', description: 'here is a description' });
  });

  it('should work for multiline description', function () {
    assert.deepEqual(since.parse('1.5.7 - description\nmore\nthan\none\nline'), { version: '1.5.7', description: 'description\nmore\nthan\none\nline' });
  });
});
