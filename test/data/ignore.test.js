/* global describe, it */
'use strict';

var assert = require('assert');

describe('#ignore', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/ignore/expected');
  var input = 'test/data/fixture/ignore';
  var data;

  before(function (done) {
    return getData(input).then(function (res) {
      data = res;
      // Quick and dirty fix for JSON Transformation.
      data['function']['test-function-ignore']['ignore'] = [null];
      done();
    });
  });

  it('should match expected data', function () {
    assert.deepEqual(data, expected);
  });

});
