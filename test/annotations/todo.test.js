/* global describe, it */
'use strict';

var assert = require('assert');

describe('#todo', function () {
  var todos = (new (require('../../src/annotation'))()).list.todo;

  it('should return the trimmed string', function () {
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('\ntest\t'), 'test');
    assert.equal(todos.parse('\nte\nst\t'), 'te\nst');
  });
});
