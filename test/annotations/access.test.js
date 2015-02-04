'use strict';

var assert = require('assert');

describe('#access', function () {
  var accessCtor = require('../../dist/annotation/annotations/access');
  var access = accessCtor({});

  it('should return the trimmed string', function () {
    assert.equal(access.parse('   '), '');
    assert.equal(access.parse('   '), '');
    assert.equal(access.parse('\ntest\t'), 'test');
    assert.equal(access.parse('\nte\nst\t'), 'te\nst');
  });

  it('should autofill based on privatePrefix', function () {
    var accessEnv = accessCtor({ privatePrefix: '^_' });
    assert.equal(accessEnv.autofill({ context: { name: 'non-private'}, access: 'public'}), undefined);
    assert.equal(accessEnv.autofill({ context: { name: '_private-name'}, access: 'public'}), 'private');
  });
});
