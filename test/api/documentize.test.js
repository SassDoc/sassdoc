'use strict'

var fs = require('fs')
var assert = require('assert')
var rimraf = require('rimraf')
var sassdoc = require('../../')

function clean (done) {
  rimraf('sassdoc', done)
}

function read (filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

describe('#documentize', function () {
  before(clean)
  after(clean)

  beforeEach(function () {
    return sassdoc('./test/data')
  })

  it('should produce documentation files', function () {
    assert.ok(fs.existsSync('sassdoc'))
    assert.ok(fs.existsSync('sassdoc/index.html'))
    assert.ok(fs.existsSync('sassdoc/assets'))
  })
})

describe('#documentize-parse', function () {
  var expected = read('test/data/expected.json').trim()
  var result

  before(function () {
    return sassdoc.parse('test/data/test.scss')
      .then(function (data) {
        result = data
      })
  })

  it('should return a proper data Array', function () {
    assert.ok(Array.isArray(result))
    assert.strictEqual(expected, JSON.stringify(result, null, 2))
  })
})
