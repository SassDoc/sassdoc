'use strict'

var assert = require('assert')

describe('#throw', function () {
  var throwCtor = require('../../dist/annotation/annotations/throw').default
  var _throw = throwCtor({})

  it('should return the trimmed string', function () {
    assert.equal(_throw.parse('   '), '')
    assert.equal(_throw.parse('   '), '')
    assert.equal(_throw.parse('\ntest\t'), 'test')
    assert.equal(_throw.parse('\nte\nst\t'), 'te\nst')
  })
})
