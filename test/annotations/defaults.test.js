'use strict'

var assert = require('assert')
var File = require('vinyl')
var sassdoc = require('../../')

describe('#defaults', function () {
  var dummy = {}

  before(function () {
    var file = new File({
      path: 'test/fixture/dummy.scss',
      contents: new Buffer('/// A dummy function\n@function dummy() {}')
    })

    var stream = sassdoc.parseFilter()
    stream.write(file)
    stream.end()

    return stream.promise.then(function (data) {
      dummy = data[0]
    })
  })

  it('should assign proper default values', function () {
    assert.deepEqual(['undefined'], dummy.group)
    assert.strictEqual('public', dummy.access)
  })
})
