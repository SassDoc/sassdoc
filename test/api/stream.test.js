'use strict';

var assert = require('assert');
var fs = require('fs');
var vfs = require('vinyl-fs');
var rimraf = require('rimraf');
var sassdoc = require('../../');

describe('#stream', function () {

  before(function () {
    var parse = sassdoc();

    vfs.src('./test/data/**/*.scss')
      .pipe(parse);

    return parse.promise;
  });

  after(function (done) {
    rimraf('sassdoc', done);
  });

  it('should produce documentation files', function () {
    assert.ok(fs.existsSync('sassdoc'));
    assert.ok(fs.existsSync('sassdoc/index.html'));
    assert.ok(fs.existsSync('sassdoc/assets'));
  });

});
