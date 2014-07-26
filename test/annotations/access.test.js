/* global describe, it */
'use strict';

var assert = require('assert');

describe('#access', function () {
  var access = require('../../src/annotation').access;

  it('should return the trimmed string', function () {
    assert.equal(access('   '), '');
    assert.equal(access('   '), '');
    assert.equal(access('\ntest\t'), 'test');
    assert.equal(access('\nte\nst\t'), 'te\nst');
  });
});
