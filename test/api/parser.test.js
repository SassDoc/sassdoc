'use strict'

var assert = require('assert')
var sinon = require('sinon')
var mock = require('../mock')
var Environment = require('../../dist/environment').default
var Parser = require('../../dist/parser').default
var source = require('vinyl-source-stream')

describe('#parser', function () {
  var warnings = []
  var message
  var logger
  var env
  var parser
  var spy

  beforeEach(function () {
    spy = sinon.spy()

    logger = new mock.Logger(true)
    env = new Environment(logger, false)
    warnings = logger.output
    env.on('warning', spy)

    parser = new Parser(env)
  })

  it('should warn if a single annotation is used more than once', function () {
    message = 'Annotation `return` is only allowed once per comment, second value will be ignored'
    parser.parse('///desc\n///@return{String}\n///@return{Array}\n@function fail(){}')

    assert.ok(spy.called)
    assert.notEqual(-1, warnings[0].indexOf(message))
  })

  it('should warn if an annotation is used on wrong type', function () {
    message = 'Annotation `type` is not allowed on comment from type `function`'
    parser.parse('///desc\n///@type{Map}\n@function fail(){}')

    assert.ok(spy.called)
    assert.notEqual(-1, warnings[0].indexOf(message))
  })

  it('should warn if an annotation is unrecognized', function () {
    message = 'Parser for annotation `shouldfail` not found'
    parser.parse('///desc\n///@shouldfail fail\n@function fail(){}')

    assert.ok(spy.called)
    assert.notEqual(-1, warnings[0].indexOf(message))
  })

  it('should warn if there\'s more than one poster comment per file', function () {
    message = 'You can\'t have more than one poster comment'
    parser.parse(
      '////\n////@group fail\n////\n\n' +
      '////\n////@group fail\n////\n\n' +
      '/// desc\n@function fail(){}'
    )

    assert.ok(spy.called)
    assert.notEqual(-1, warnings[0].indexOf(message))
  })

  it('should include unknown contexts if requested by theme', function () {
    parser.includeUnknownContexts = true
    var parseStream = parser.stream()

    var sourceStream = source('fake')
    sourceStream.end('///desc\n')
    sourceStream.pipe(parseStream)
    return parseStream.promise.then(data => {
      assert.equal(data.length, 1)
      assert.equal(data[0].context.type, 'unknown')
    })
  })
})
