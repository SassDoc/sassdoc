/* global describe, it */
'use strict';

var assert = require('assert');

describe('#alias', function () {
  var alias = (new (require('../../src/annotation'))()).list.alias;

  it('should return the trimmed string', function () {
    assert.equal(alias.parse('   '), '');
    assert.equal(alias.parse('   '), '');
    assert.equal(alias.parse('\ntest\t'), 'test');
    assert.equal(alias.parse('\nte\nst\t'), 'te\nst');
  });
});
