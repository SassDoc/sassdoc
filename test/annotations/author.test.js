'use strict'

var assert = require('assert')

describe('#author', function () {
  var authorCtor = require('../../dist/annotation/annotations/author').default
  var author = authorCtor({})

  it('should return the trimmed string', function () {
    assert.equal(author.parse('   '), '')
    assert.equal(author.parse('   '), '')
    assert.equal(author.parse('\ntest\t'), 'test')
    assert.equal(author.parse('\nte\nst\t'), 'te\nst')
  })
})
