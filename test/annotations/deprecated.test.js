'use strict'

var assert = require('assert')

describe('#deprecated', function () {
  var deprecatedCtor = require('../../dist/annotation/annotations/deprecated').default
  var deprecated = deprecatedCtor({})

  it('should return the trimmed string', function () {
    assert.equal(deprecated.parse('   '), '')
    assert.equal(deprecated.parse('   '), '')
    assert.equal(deprecated.parse('\ntest\t'), 'test')
    assert.equal(deprecated.parse('\nte\nst\t'), 'te\nst')
  })
})
