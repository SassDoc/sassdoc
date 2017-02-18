'use strict'

var assert = require('assert')

describe('#type', function () {
  var typeCtor = require('../../dist/annotation/annotations/type').default
  var type = typeCtor({})

  it('should return the trimmed string', function () {
    assert.equal(type.parse('   '), '')
    assert.equal(type.parse('   '), '')
    assert.equal(type.parse('\ntest\t'), 'test')
    assert.equal(type.parse('\nte\nst\t'), 'te\nst')
  })
})
