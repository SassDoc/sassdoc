/* global describe, it */
'use strict';

var assert = require('assert');

describe('#parameters', function () {
  var returns = require('../../src/annotation').returns;

  it('should return an object', function () {
    assert.deepEqual(returns('{type} $hyphenated-name (default) - description'), { type: 'type', name: 'hyphenated-name', default: 'default', description: '<p>description</p>\n' });
    assert.deepEqual(returns('{type} $name (()) - description'), { type: 'type', name: 'name', default: '()', description: '<p>description</p>\n' });
    assert.deepEqual(returns('{List} $list - list to check'), { type: 'List', name: 'list', description: '<p>list to check</p>\n' });
  });

  it('should parse all chars in type', function () {
    assert.deepEqual(returns('{*} $name - description'), { type: '*', name: 'name', description: '<p>description</p>\n' });
    assert.deepEqual(returns('{type|other} $name - description'), { type: 'type|other', name: 'name', description: '<p>description</p>\n' });
  });
});
