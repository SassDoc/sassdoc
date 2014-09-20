/* global describe, it */
'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');


describe('#sass-convert', function () {
  var converter = require('../../src/convert')();
  var src = path.join(__dirname, 'fixture/convert');
  var file = path.join(converter.tmpDir, 'test.scss');
  converter.src = src;

  describe('Sass to SCSS convertion', function () {
    before(function () {
      return converter.convert();
    });

    it('should produce SCSS files', function () {
      assert.ok(fs.existsSync(converter.tmpDir));
      assert.ok(fs.existsSync(file));
    });

    it('should contain correct comments', function () {
      var regex = /\/\*\*/;
      var body = fs.readFileSync(file, 'utf8');
      assert.ok(regex.test(body), file + ' did not match \'' + regex + '\'.');
    });
  });

  describe('SassDoc documentize after a Sass to SCSS conversion', function () {
    before(function () {
      mkdirp('tmp');

      return converter.documentize(src, 'tmp/docs');
    });

    after(function (done) {
      rimraf('tmp', done);
    });

    it('should produce SassDoc documentation', function () {
      assert.ok(fs.existsSync('tmp/docs'));
      assert.ok(fs.existsSync('tmp/docs/index.html'));
      assert.ok(fs.existsSync('tmp/docs/assets'));
    });

    it('should contain correct content', function () {
      var regex = /test-mix-public/;
      var index = 'tmp/docs/index.html';
      var body = fs.readFileSync(index, 'utf8');
      assert.ok(regex.test(body), index + ' did not match \'' + regex + '\'.');
    });

    it('should clean the temporary dir', function () {
      assert.ok(!fs.existsSync(converter.tmpDir));
    });
  });

});
