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
    /**
     * Do not, never, ever, call this variable `data`.
     *
     * @see https://twitter.com/HugoGiraudel/status/503253144940601344
     */
    var dataClone = _.clone(data, true);

    delete dataClone['function']['test-function-requires'].requires.toJSON;
    assert.deepEqual(dataClone, expected);
  });

  it('should be JSON serializable', function () {
    assert.equal(JSON.stringify(data, null, '  '), JSON.stringify(expected, null, '  '));
  });
});
