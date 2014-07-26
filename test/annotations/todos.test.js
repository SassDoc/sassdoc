/* global describe, it */
'use strict';

var assert = require('assert');

describe('#throws', function () {
  var todos = require('../../src/annotation').todos;

  it('should return the trimmed string', function () {
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('\ntest\t'), '<p>test</p>\n');
    assert.equal(todos.parse('\nte\nst\t'), '<p>te\nst</p>\n');
  });
});
