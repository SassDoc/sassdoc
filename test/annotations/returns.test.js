/* global describe, it */
'use strict';

var assert = require('assert');

describe('#parameters', function () {
  var returns = (new (require('../../src/annotation'))()).list.returns;

  it('should return an object', function () {
    assert.deepEqual(returns.parse('{type} $hyphenated-name (default) - description'), { type: 'type', name: 'hyphenated-name', default: 'default', description: 'description' });
    assert.deepEqual(returns.parse('{type} $name (()) - description'), { type: 'type', name: 'name', default: '()', description: 'description' });
    assert.deepEqual(returns.parse('{List} $list - list to check'), { type: 'List', name: 'list', description: 'list to check' });
  });

  it('should parse all chars in type', function () {
    assert.deepEqual(returns.parse('{*} $name - description'), { type: '*', name: 'name', description: 'description' });
    assert.deepEqual(returns.parse('{type|other} $name - description'), { type: 'type|other', name: 'name', description: 'description' });
  });

  it('should work for multiline description', function () {
    assert.deepEqual(returns.parse('{type} $hyphenated-name (default) - description\nmore\nthan\none\nline'), { type: 'type', name: 'hyphenated-name', default: 'default', description: 'description\nmore\nthan\none\nline' });
  });
});
