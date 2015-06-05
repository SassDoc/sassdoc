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

  it('should autofill based on default', function () {
    assert.equal(access.autofill({ context: { name: 'non-private'}, access: 'auto'}), 'public');
    assert.equal(access.autofill({ context: { name: '_private-name'}, access: 'auto'}), 'private');
    assert.equal(access.autofill({ context: { name: '-private-name'}, access: 'auto'}), 'private');
  });

  it('should ignore autofill if privatePrefix is false', function () {
    var accessEnv = accessCtor({ privatePrefix: false });
    assert.equal(accessEnv.autofill({ context: { name: 'non-private'}, access: 'auto'}), undefined);
    assert.equal(accessEnv.autofill({ context: { name: '_private-name'}, access: 'auto'}), undefined);
    assert.equal(accessEnv.autofill({ context: { name: '-private-name'}, access: 'auto'}), undefined);
  });

  it('should autofill based on privatePrefix', function () {
    var accessEnv = accessCtor({ privatePrefix: '^--' });
    assert.equal(accessEnv.autofill({ context: { name: '-non-private'}, access: 'auto'}), 'public');
    assert.equal(accessEnv.autofill({ context: { name: '_non-private'}, access: 'auto'}), 'public');
    assert.equal(accessEnv.autofill({ context: { name: '--private-name'}, access: 'auto'}), 'private');
  });

  it('should respect explicit access', function () {
    assert.equal(access.autofill({ context: { name: 'non-private'}, access: 'public'}), undefined);
    assert.equal(access.autofill({ context: { name: 'private'}, access: 'private'}), undefined);
    assert.equal(access.autofill({ context: { name: '_private-name'}, access: 'auto'}), 'private');
  });

  it('should work when not autofilled', function () {
    var data = [{ access: 'auto' }];
    access.resolve(data);
    assert.equal(data[0].access, 'public');
  });
});
