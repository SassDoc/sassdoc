/* global describe, it */
'use strict';

var assert = require('assert');

describe('#ignore', function () {
  var ignore = require('../../src/annotation').ignore;

  it('should return nothing', function () {
    assert.equal(ignore.parse('\nte\nst\t'), undefined);
    assert.equal(ignore.parse(''), undefined);
    assert.equal(ignore.parse(), undefined);
  });
});
