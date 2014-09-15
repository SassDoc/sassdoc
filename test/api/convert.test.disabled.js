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
  converter.src = src;

  describe('Sass to SCSS convertion', function () {
    before(function () {
      return converter.convert();
    });

    it('should produce SCSS files', function () {
      assert.ok(fs.existsSync(converter.tmpDir));
      assert.ok(fs.existsSync(path.join(converter.tmpDir, 'test.scss')));
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

    it('should clean the temporary dir', function () {
      assert.ok(!fs.existsSync(converter.tmpDir));
    });
  });

});
