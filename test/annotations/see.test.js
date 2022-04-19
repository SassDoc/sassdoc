'use strict'

var assert = require('assert')

describe('#see', function () {
  var seeCtor = require('../../dist/annotation/annotations/see').default
  var see = seeCtor({})

  it('should default to function', function () {
    assert.deepEqual(see.parse('name'), { type: 'function', name: 'name' })
  })

  it('should rewrite the .toJSON method', function () {
    var data = [{ description: 'desc', context: { name: 'name' }, group: 'test' }, { see: [see.parse('name')] }]
    see.resolve(data)
    assert.deepEqual(data[1].see.toJSON(), [{ description: 'desc', context: { name: 'name' }, group: 'test' }])
  })
})
