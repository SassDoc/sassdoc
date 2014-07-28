/* global describe, it */
'use strict';

var assert = require('assert');

describe('#example', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/example/expected');
  var input = 'test/data/fixture/example';
  var data;

  before(function (done) {
    return getData(input).then(function (res) {
      data = res;
      done();
    });
  });

  it('should match expected data', function () {
    assert.deepEqual(data, expected);
  });

});
