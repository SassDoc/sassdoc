/* global describe, it */
'use strict';

var assert = require('assert');
describe('#access', function () {
  var access = (new (require('../../src/annotation'))()).list.access;
  it('should return the trimmed string', function () {
    assert.equal(access.parse('   '), '');
    assert.equal(access.parse('   '), '');
    assert.equal(access.parse('\ntest\t'), 'test');
    assert.equal(access.parse('\nte\nst\t'), 'te\nst');
  });
});
