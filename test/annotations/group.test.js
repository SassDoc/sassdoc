/* global describe, it */
'use strict';

var assert = require('assert');

describe('#group', function () {
  var group = require('../../src/annotation').group;

  it('should parse a single group and ingore case', function () {
    assert.deepEqual(group('group'), ['group']);
    assert.deepEqual(group('GRoup'), ['group']);
  });
});
