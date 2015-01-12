'use strict';

var assert = require('assert');
var fs = require('fs');
var rimraf = require('rimraf');
var sassdoc = require('../../');

describe('#documentize', function () {

  before(function () {
    return sassdoc('./test/data');
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
