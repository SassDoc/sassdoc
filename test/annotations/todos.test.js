/* global describe, it */
'use strict';

var assert = require('assert');

describe('#throws', function () {
  var todos = (new (require('../../src/annotation'))()).list.todos;

  it('should return the trimmed string', function () {
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('   '), '');
    assert.equal(todos.parse('\ntest\t'), 'test');
    assert.equal(todos.parse('\nte\nst\t'), 'te\nst');
  });
});
