/* global describe, it */
'use strict';

var assert = require('assert');

describe('#link', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/link/expected');
  var input = 'test/data/fixture/link';
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
