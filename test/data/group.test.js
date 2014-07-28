/* global describe, it */
'use strict';

var assert = require('assert');

describe('#group', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/group/expected');
  var input = 'test/data/fixture/group';
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
