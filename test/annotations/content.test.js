'use strict'

var assert = require('assert')

describe('#content', function () {
  var contentCtor = require('../../dist/annotation/annotations/content').default
  var content = contentCtor({})

  it('should return object', function () {
    assert.deepEqual(content.parse('Test'), 'Test')
    assert.deepEqual(content.parse('\nTest\t'), 'Test')
    assert.deepEqual(content.parse('\nTest\n\nTest\t'), 'Test\n\nTest')
  })

  it('should add @content to all items that contain it in item.context.code', function () {
    assert.deepEqual(content.autofill({ context: { code: '@content' } }), '')
  })
})
