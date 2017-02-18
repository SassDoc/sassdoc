'use strict'

var assert = require('assert')

describe('#property', function () {
  var propertyCtor = require('../../dist/annotation/annotations/property').default
  var prop = propertyCtor({})

  it('should parse the prop annotation', function () {
    assert.deepEqual(prop.parse('base'), {
      type: 'Map',
      name: 'base'
    })

    assert.deepEqual(prop.parse('{Function} base.default'), {
      type: 'Function',
      name: 'base.default'
    })

    assert.deepEqual(prop.parse('{Function} base.default - description'), {
      type: 'Function',
      name: 'base.default',
      description: 'description'
    })

    assert.deepEqual(prop.parse('{Function} base.default [default] - description'), {
      type: 'Function',
      name: 'base.default',
      default: 'default',
      description: 'description'
    })

    assert.deepEqual(prop.parse('{Function} base.default [default] - description [with brackets]'), {
      type: 'Function',
      name: 'base.default',
      default: 'default',
      description: 'description [with brackets]'
    })
  })

  it('should work for multiline description', function () {
    assert.deepEqual(prop.parse('{Function} base.default [default] - description\nmore\nthan\none\nline'), {
      type: 'Function',
      name: 'base.default',
      default: 'default',
      description: 'description\nmore\nthan\none\nline'
    })
  })
})
