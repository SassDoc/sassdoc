'use strict'

var assert = require('assert')

describe('#output', function () {
  var outputCtor = require('../../dist/annotation/annotations/output').default
  var output = outputCtor({})

  it('should parse an output description', function () {
    assert.deepEqual(output.parse('position'), 'position')
  })

  it('should parse include linebreaks', function () {
    assert.deepEqual(output.parse('one\ntwo\nthree'), 'one\ntwo\nthree')
  })
})
