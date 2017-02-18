'use strict'

var assert = require('assert')
var errors = require('../../dist/errors')

describe('#errors', function () {
  var SassDocError
  var Warning
  var errMess = 'An Error message from test'
  var warnMess = 'A Warning message from test'

  before(function () {
    SassDocError = new errors.SassDocError(errMess)
    Warning = new errors.Warning(warnMess)
  })

  it('should have the proper constructor', function () {
    assert.ok(SassDocError instanceof errors.SassDocError)
    assert.ok(Warning instanceof errors.Warning)
  })

  it('should have the proper super constructor', function () {
    assert.ok(SassDocError instanceof Error)
    assert.ok(Warning instanceof errors.SassDocError)
  })

  it('should properly output `name` getter', function () {
    assert.ok(SassDocError.name === 'SassDocError')
    assert.ok(Warning.name === 'Warning')
  })

  it('should properly output `message` property', function () {
    assert.ok(SassDocError.message === errMess)
    assert.ok(Warning.message === warnMess)
  })
})
