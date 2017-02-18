'use strict'

var assert = require('assert')

describe('#link', function () {
  var linkCtor = require('../../dist/annotation/annotations/link').default
  var link = linkCtor({})

  it('should return an object', function () {
    assert.deepEqual(link.parse(''), { url: '', caption: '' })
  })

  it('should work with funny spaces and linebreaks', function () {
    assert.deepEqual(link.parse('\t\n\nhttp://sass.com    \t\n\n'), { url: 'http://sass.com', caption: '' })
  })

  it('should return the caption optionally', function () {
    assert.deepEqual(link.parse('http://sass.com'), { url: 'http://sass.com', caption: '' })
    assert.deepEqual(link.parse('caption'), { url: '', caption: 'caption' })
    assert.deepEqual(link.parse('http://sass.com caption'), { url: 'http://sass.com', caption: 'caption' })
    assert.deepEqual(link.parse('http://sass.com multiple words caption'), { url: 'http://sass.com', caption: 'multiple words caption' })
  })
})
