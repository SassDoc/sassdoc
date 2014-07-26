/* global describe, it */
'use strict';

var assert = require('assert');

describe('#ignore', function () {
  var ignore = require('../../src/annotation').ignore;

  it('should return nothing', function () {
    assert.equal(ignore('\nte\nst\t'), undefined);
    assert.equal(ignore(''), undefined);
    assert.equal(ignore(), undefined);
  });
});
