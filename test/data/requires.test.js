/* global describe, it */
'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('#requires', function () {
  var getData = require('../../src/file').getData;

  var expected = require('./fixture/requires/expected');
  var input = 'test/data/fixture/requires';
  var data;

  before(function (done) {
    return getData(input).then(function (res) {
      data = res;
      done();
    });
  });

  it('should match expected data', function () {
    var data = _.clone(data);
    delete data['function']['test-function-requires'].requires.toJSON;
    assert.deepEqual(data, expected);
  });

  it('should be JSON serializable', function () {
    assert.equal(JSON.stringify(data, null, '  '), JSON.stringify(expected, null, '  '));
  });
});
