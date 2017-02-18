'use strict'

var assert = require('assert')

describe('#todo', function () {
  var todoCtor = require('../../dist/annotation/annotations/todo').default
  var todo = todoCtor({})

  it('should return the trimmed string', function () {
    assert.equal(todo.parse('   '), '')
    assert.equal(todo.parse('   '), '')
    assert.equal(todo.parse('\ntest\t'), 'test')
    assert.equal(todo.parse('\nte\nst\t'), 'te\nst')
  })
})
