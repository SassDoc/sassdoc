'use strict';

var assert = require('assert');

describe('#name', function () {
  var name = (new (require('../../dist/annotation').default)()).list.name;

  it('should return the trimmed string', function () {
    assert.equal(name.parse('   '), '');
    assert.equal(name.parse('   '), '');
    assert.equal(name.parse('\ntest\t'), 'test');
    assert.equal(name.parse('\nte\nst\t'), 'te\nst');
  });
});
