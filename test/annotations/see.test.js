/* global describe, it */
'use strict';

var assert = require('assert');

describe('#see', function () {
  var see = require('../../src/annotation').see;

  it('should default to function', function () {
    assert.deepEqual(see.parse('name'), { type: 'function', name: 'name' });
  });
});
