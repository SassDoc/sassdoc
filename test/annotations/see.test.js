'use strict';

require('../init');

var assert = require('assert');

describe('#see', function () {
  var see = (new (require('../../dist/annotation').default)()).list.see;

  it('should default to function', function () {
    assert.deepEqual(see.parse('name'), { type: 'function', name: 'name' });
  });
});
