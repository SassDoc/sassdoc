'use strict';

require('../init');

var assert = require('assert');

describe('#throw', function () {
  var _throw = (new (require('../../dist/annotation'))()).list.throw;

  it('should return the trimmed string', function () {
    assert.equal(_throw.parse('   '), '');
    assert.equal(_throw.parse('   '), '');
    assert.equal(_throw.parse('\ntest\t'), 'test');
    assert.equal(_throw.parse('\nte\nst\t'), 'te\nst');
  });
});
