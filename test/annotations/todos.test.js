/* global describe, it */
'use strict';

var assert = require('assert');

describe('#throws', function () {
  var todos = require('../../src/annotation').todos;

  it('should return the trimmed string', function () {
    assert.equal(todos('   '), '');
    assert.equal(todos('   '), '');
    assert.equal(todos('\ntest\t'), '<p>test</p>\n');
    assert.equal(todos('\nte\nst\t'), '<p>te\nst</p>\n');
  });
});
