'use strict';

require('../init');

var assert = require('assert');
var fs = require('fs');
var utils = require('../../dist/utils');
var readFile = utils.denodeify(fs.readFile);

describe('#utils:denodeify', function () {

  it('should catch errors', function () {
    assert.doesNotThrow(function () {
      readFile('fail');
    });
  });

  it('should reject errors', function () {
    return readFile('fail')
      .catch(function (err) {
        assert.ok(utils.is.error(err));
        assert.ok(err.code === 'ENOENT');
      });
  });

  it('should resolve data', function () {
    return readFile('README.md', 'utf8')
      .then(function (data) {
        assert.ok(utils.is.string(data));
        assert.ok(/# SassDoc/.test(data));
      });
  });

});
