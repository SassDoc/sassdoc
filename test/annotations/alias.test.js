'use strict'

var assert = require('assert')

describe('#alias', function () {
  var aliasCtor = require('../../dist/annotation/annotations/alias').default
  var alias = aliasCtor({})

  it('should return the trimmed string', function () {
    assert.equal(alias.parse('   '), '')
    assert.equal(alias.parse('   '), '')
    assert.equal(alias.parse('\ntest\t'), 'test')
    assert.equal(alias.parse('\nte\nst\t'), 'te\nst')
  })
})
