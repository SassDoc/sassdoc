'use strict';

var assert = require('assert');
var vfs = require('vinyl-fs');
var through = require('through2');
var exclude = require('../../dist/exclude');

describe('#exclude', function () {
  var files = [];

  function inspect() {
    return through.obj(function (file, enc, cb) {
      files.push(file.relative);
      cb(null, file);
    });
  }

  before(function (done) {
    vfs.src('./test/fixture/**/*.scss')
      .pipe(exclude(['two.scss']))
      .pipe(inspect())
      .on('end', done)
      .resume();
  });

  it('should properly exlude file patterns', function () {
    assert.strictEqual(2, files.length);
    assert.strictEqual(-1, files.indexOf('two.css'));
  });

});
