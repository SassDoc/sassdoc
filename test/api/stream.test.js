'use strict'

var assert = require('assert')
var fs = require('fs')
var vfs = require('vinyl-fs')
var source = require('vinyl-source-stream')
var rimraf = require('rimraf')
var sassdoc = require('../../')

function clean (done) {
  rimraf('sassdoc', done)
}

function read (filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

describe('#stream-buffer', function () {
  before(clean)
  after(clean)

  beforeEach(function () {
    var stream = sassdoc()

    vfs.src('./test/data/**/*.scss')
      .pipe(stream)

    return stream.promise
  })

  it('should produce documentation files', function () {
    assert.ok(fs.existsSync('sassdoc'))
    assert.ok(fs.existsSync('sassdoc/index.html'))
    assert.ok(fs.existsSync('sassdoc/assets'))
  })
})

describe('#stream-stream', function () {
  before(clean)
  after(clean)

  beforeEach(function () {
    var stream = sassdoc()

    fs.createReadStream('test/data/test.scss')
      .pipe(source())
      .pipe(stream)

    return stream.promise
  })

  it('should produce documentation files', function () {
    assert.ok(fs.existsSync('sassdoc'))
    assert.ok(fs.existsSync('sassdoc/index.html'))
    assert.ok(fs.existsSync('sassdoc/assets'))
  })
})

describe('#stream-parse', function () {
  var expected = read('test/data/expected.json').trim()
  var result

  before(function (done) {
    vfs.src('./test/data/**/*.scss')
      .pipe(sassdoc.parse())
      .on('data', function (data) {
        result = data
        done()
      })
  })

  it('should return a proper data Array', function () {
    assert.ok(Array.isArray(result))
    assert.strictEqual(expected, JSON.stringify(result, null, 2))
  })
})
