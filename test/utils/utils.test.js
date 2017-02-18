'use strict'

var assert = require('assert')
var fs = require('fs')
var utils = require('../../dist/utils')
var readFile = utils.denodeify(fs.readFile)
var errors = require('../../dist/errors')

describe('#utils:denodeify', function () {
  it('should catch errors', function () {
    assert.doesNotThrow(function () {
      readFile('fail').catch(function (err) {
        assert.ok(utils.is.error(err))
      })
    })
  })

  it('should reject errors', function () {
    return readFile('fail')
      .catch(function (err) {
        assert.ok(utils.is.error(err))
        assert.ok(err.code === 'ENOENT')
      })
  })

  it('should resolve data', function () {
    return readFile('test/fixture/denodeify.txt', 'utf8')
      .then(function (data) {
        assert.ok(utils.is.string(data))
        assert.ok(/whoot/.test(data))
      })
  })
})

describe('#utils:is', function () {
  it('should provide utils.is.*', function () {
    // .stream
    assert.equal(utils.is.stream({ pipe: function () {} }), true)
    assert.equal(utils.is.stream(), undefined)
    // .undef
    assert.equal(utils.is.undef(1), false)
    assert.equal(utils.is.undef(), true)
    // .error
    assert.equal(utils.is.error(null), false)
    assert.equal(utils.is.error(new errors.SassDocError()), true)
    // .string
    assert.equal(utils.is.string(), false)
    // .function
    assert.equal(utils.is.function(), false)
    assert.equal(utils.is.function(function () {}), true)
    // .object
    assert.equal(utils.is.object(), false)
    assert.equal(utils.is.object(1), false)
    assert.equal(utils.is.object(''), false)
    assert.equal(utils.is.object({}), true)
    assert.equal(utils.is.object(new Error()), true)
    // .plainObject
    assert.equal(utils.is.plainObject(), false)
    assert.equal(utils.is.plainObject(1), false)
    assert.equal(utils.is.plainObject(new Error()), false)
    assert.equal(utils.is.plainObject({}), true)
    // .array
    assert.equal(utils.is.array(), false)
    assert.equal(utils.is.array(1), false)
    assert.equal(utils.is.array(''), false)
    assert.equal(utils.is.array([]), true)
  })
})
