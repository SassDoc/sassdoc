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
    var expectedClone = _.clone(expected , true);

    var requires = dataClone['function']['test-function-requires'];
    var required = dataClone['function']['test-function-required'];

    assert.equal(requires.requires[0].item, required);
    assert.equal(required.usedBy[0], requires);

    // Remove circular structure from the clone
    delete requires.requires.toJSON;
    delete requires.requires[0].item;
    delete required.usedBy.toJSON;

    // Include the reference
    expectedClone['function']['test-function-required'].usedBy[0] = expectedClone['function']['test-function-requires'];

    assert.deepEqual(dataClone, expectedClone);
  });

  it('should be JSON serializable', function () {
    var dataClone = _.clone(data, true);

    assert.equal(JSON.stringify(data, null, '  '), JSON.stringify(expected, null, '  '));
  });
});
