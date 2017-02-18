'use strict'

var assert = require('assert')

describe('#require', function () {
  var requireCtor = require('../../dist/annotation/annotations/require').default
  var _require = requireCtor({})

  it('should default to function', function () {
    assert.deepEqual(_require.parse('name - description'), { type: 'function', name: 'name', description: 'description', 'external': false })
    assert.deepEqual(_require.parse('name description'), { type: 'function', name: 'name', description: 'description', 'external': false })
  })

  it('should work for variables with or without $', function () {
    assert.deepEqual(_require.parse('{variable} $my-variable'), { type: 'variable', name: 'my-variable', 'external': false })
    assert.deepEqual(_require.parse('{variable} my-variable'), { type: 'variable', name: 'my-variable', 'external': false })
  })

  it('should work with optional variable type if $ is used', function () {
    assert.deepEqual(_require.parse('{variable} my-variable'), { type: 'variable', name: 'my-variable', 'external': false })
    assert.deepEqual(_require.parse('$my-variable'), { type: 'variable', name: 'my-variable', 'external': false })
  })

  it('should work for placeholders with or without %', function () {
    assert.deepEqual(_require.parse('{placeholder} %my-placeholder'), { type: 'placeholder', name: 'my-placeholder', 'external': false })
    assert.deepEqual(_require.parse('{placeholder} my-placeholder'), { type: 'placeholder', name: 'my-placeholder', 'external': false })
  })

  it('should work with optional placeholder type if % is used', function () {
    assert.deepEqual(_require.parse('{placeholder} my-placeholder'), { type: 'placeholder', name: 'my-placeholder', 'external': false })
    assert.deepEqual(_require.parse('%my-placeholder'), { type: 'placeholder', name: 'my-placeholder', 'external': false })
  })

  it('should work for external requires', function () {
    assert.deepEqual(_require.parse('{variable} extern::lib'), { type: 'variable', name: 'extern::lib', 'external': true })
    assert.deepEqual(_require.parse('extern::lib'), { type: 'function', name: 'extern::lib', 'external': true })
    assert.deepEqual(_require.parse('$extern::lib'), { type: 'variable', name: 'extern::lib', 'external': true })
  })

  it('should work for external requires with url', function () {
    assert.deepEqual(_require.parse('{variable} extern::lib - description <http://url.com>'),
                    { type: 'variable', name: 'extern::lib', 'external': true, 'description': 'description', 'url': 'http://url.com' })
  })

  it('should work for name and url', function () {
    assert.deepEqual(_require.parse('SassCore::map-has-key <http://sass-lang.com/documentation/Sass/Script/Functions.html#map_has_key-instance_method>'),
                    { type: 'function', name: 'SassCore::map-has-key', 'external': true, 'url': 'http://sass-lang.com/documentation/Sass/Script/Functions.html#map_has_key-instance_method' })
  })

  it('should work for multiline description', function () {
    assert.deepEqual(_require.parse('name - description\nmore\nthan\none\nline'), { type: 'function', name: 'name', description: 'description\nmore\nthan\none\nline', 'external': false })
  })

  it('should resolve by type and name', function () {
    var data = [
      { context: { type: 'function', name: 'rem' } },
      { context: { type: 'mixin', name: 'rem' } },
      { context: { type: 'mixin', name: 'test' }, require: [ { type: 'mixin', name: 'rem' } ] }
    ]

    _require.resolve(data)

    assert.deepEqual(data[2].require[0].item.context, { type: 'mixin', name: 'rem' })
  })
})
