'use strict';

require('../init');

var assert = require('assert');

describe('#todo', function () {
  var todo = (new (require('../../dist/annotation'))()).list.todo;

  it('should return the trimmed string', function () {
    assert.equal(todo.parse('   '), '');
    assert.equal(todo.parse('   '), '');
    assert.equal(todo.parse('\ntest\t'), 'test');
    assert.equal(todo.parse('\nte\nst\t'), 'te\nst');
  });
});
