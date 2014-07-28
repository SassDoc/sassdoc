/* global describe, it */
'use strict';

var assert = require('assert');

describe('#access', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/access/expected');
  var input = 'test/data/fixture/access';
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
