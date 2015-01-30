'use strict';

require('../init');

var assert = require('assert');
var vfs = require('vinyl-fs');
var through = require('through2');
var recurse = require('../../dist/recurse');

describe('#recurse', function () {
  var files = [];

  function inspect() {
    return through.obj(function (file, enc, cb) {
      files.push(file.relative);
      cb(null, file);
    });
  }

  before(function (done) {
    vfs.src('./test/fixture/')
      .pipe(recurse())
      .pipe(inspect())
      .on('end', done)
      .resume();
  });

  it('should properly recurse a given directory', function () {
    assert.strictEqual(3, files.length);
    assert.deepEqual(files.sort(), [ 'one.scss', 'three.scss', 'two.scss' ]);
  });

});
