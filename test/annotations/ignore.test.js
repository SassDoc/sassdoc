'use strict'

var assert = require('assert')

describe('#ignore', function () {
  var ignoreCtor = require('../../dist/annotation/annotations/ignore').default
  var ignore = ignoreCtor({})

  it('should return nothing', function () {
    assert.equal(ignore.parse('\nte\nst\t'), undefined)
    assert.equal(ignore.parse(''), undefined)
    assert.equal(ignore.parse(), undefined)
  })
})
