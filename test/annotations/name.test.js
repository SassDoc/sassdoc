'use strict'

var assert = require('assert')

describe('#name', function () {
  var nameCtor = require('../../dist/annotation/annotations/name').default
  var name = nameCtor({})

  it('should return the trimmed string', function () {
    assert.equal(name.parse('   '), '')
    assert.equal(name.parse('   '), '')
    assert.equal(name.parse('\ntest\t'), 'test')
    assert.equal(name.parse('\nte\nst\t'), 'te\nst')
  })
})
