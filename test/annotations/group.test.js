'use strict'

var assert = require('assert')

describe('#group', function () {
  var groupCtor = require('../../dist/annotation/annotations/group').default
  var group = groupCtor({})

  it('should parse a single group and ingore case', function () {
    assert.deepEqual(group.parse('group'), ['group'])
    assert.deepEqual(group.parse('GRoup'), ['group'])
  })

  it('should parse a description from subsequent lines', function () {
    var item = {}
    assert.deepEqual(group.parse('group\ndescription', item), ['group'])
    assert.deepEqual(item, {'groupDescriptions': {
      'group': 'description'
    }})
  })
})
