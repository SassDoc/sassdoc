/* global describe, it */
'use strict';

var assert = require('assert');

describe('#alias', function () {
  var alias = require('../../src/annotation').alias;

  it('should return the trimmed string', function () {
    assert.equal(alias('   '), '');
    assert.equal(alias('   '), '');
    assert.equal(alias('\ntest\t'), 'test');
    assert.equal(alias('\nte\nst\t'), 'te\nst');
  });
});
