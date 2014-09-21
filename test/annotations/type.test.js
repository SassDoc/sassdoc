/* global describe, it */
'use strict';

var assert = require('assert');

describe('#type', function () {
  var type = (new (require('../../src/annotation'))()).list.type;

  it('should return the trimmed string', function () {
    assert.equal(type.parse('   '), '');
    assert.equal(type.parse('   '), '');
    assert.equal(type.parse('\ntest\t'), 'test');
    assert.equal(type.parse('\nte\nst\t'), 'te\nst');
  });
});
