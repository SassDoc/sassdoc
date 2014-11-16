'use strict';

require('../init');

var assert = require('assert');

describe('#deprecated', function () {
  var deprecated = (new (require('../../dist/annotation').default)()).list.deprecated;

  it('should return the trimmed string', function () {
    assert.equal(deprecated.parse('   '), '');
    assert.equal(deprecated.parse('   '), '');
    assert.equal(deprecated.parse('\ntest\t'), 'test');
    assert.equal(deprecated.parse('\nte\nst\t'), 'te\nst');
  });
});
