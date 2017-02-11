'use strict'

var assert = require('assert')
var sinon = require('sinon')
var vfs = require('vinyl-fs')
var File = require('vinyl')
var through = require('through2')
var recurse = require('../../dist/recurse').default

describe('#recurse', function () {
  var files = []

  before(function (done) {
    vfs.src('./test/fixture/')
      .pipe(recurse())
      .pipe(through.obj(function (file, enc, cb) {
        files.push(file.relative)
        cb(null, file)
      }))
      .on('end', done)
      .resume()
  })

  it('should properly recurse a given directory', function () {
    assert.strictEqual(3, files.length)
    assert.deepEqual(files.sort(), [ 'one.scss', 'three.scss', 'two.scss' ])
  })
})

describe('#recurse-null', function () {
  var files = []
  var nullFile = new File({
    contents: null
  })

  before(function (done) {
    vfs.src('./test/fixture/')
      .pipe(through.obj(function (file, enc, cb) {
        this.push(nullFile)
        cb(null, file)
      }))
      .pipe(recurse())
      .pipe(through.obj(function (file, enc, cb) {
        files.push(file.relative)
        cb(null, file)
      }))
      .on('end', done)
      .resume()
  })

  it('should not pass null files through', function () {
    assert.strictEqual(3, files.length)
  })
})

describe('#recurse-fail', function () {
  var spy = sinon.spy()

  before(function (done) {
    vfs.src('./test/fixture/')
      .pipe(through.obj(function (file, enc, cb) {
        this.push({ fail: 'fail' })
        cb()
      }))
      .pipe(recurse())
      .on('error', function () {
        spy()
        done()
      })
      .resume()
  })

  it('should fail if non Vinyl objects are passed', function () {
    assert.ok(spy.called)
  })
})
