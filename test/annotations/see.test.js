/* global describe, it */
'use strict';

var assert = require('assert');

describe('#see', function () {
  var requires = require('../../src/annotation').see;

  it('should default to function', function () {
    assert.deepEqual(requires.parse('name'), { type: 'function', name: 'name' });
  });
});
