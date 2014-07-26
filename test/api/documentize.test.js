/* global describe, it */
'use strict';

var assert = require('assert');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

describe('#documentize', function () {
  var documentize = require('../../src/api').documentize;

  // Test for empty documentation.
  describe('empty documentation', function () {
    before(function (done) {
      mkdirp('tmp/empty');

      documentize('tmp/empty', 'tmp/docs')
        .then(done)
        .catch(done);
    });

    after(function (done) {
      rimraf('tmp', done);
    });

    it('should produce an empty documentation', function () {
      assert.ok(fs.existsSync('tmp/docs'));
      assert.ok(fs.existsSync('tmp/docs/index.html'));
      assert.ok(fs.existsSync('tmp/docs/assets'));
    });
  });

});
