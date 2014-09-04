/* global describe, it */
'use strict';

var assert = require('assert');

describe('#prop', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/prop/expected');
  var input = 'test/data/fixture/prop';
  var data;

  before(function (done) {
    getData(input).then(function (res) {
      data = res;
      done();
    });
  });

  it('should match expected data', function () {
    assert.deepEqual(data, expected);
  });

});
