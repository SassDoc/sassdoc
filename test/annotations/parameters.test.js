/* global describe, it */
'use strict';

var assert = require('assert');

describe('#parameters', function () {
  var param = require('../../src/annotation').parameters;

  it('should return an object', function () {
    assert.deepEqual(param.parse('{type} $hyphenated-name (default) - description'), { type: 'type', name: 'hyphenated-name', default: 'default', description: '<p>description</p>\n' });
    assert.deepEqual(param.parse('{type} $name (()) - description'), { type: 'type', name: 'name', default: '()', description: '<p>description</p>\n' });
    assert.deepEqual(param.parse('{List} $list - list to check'), { type: 'List', name: 'list', description: '<p>list to check</p>\n' });
  });

  it('should parse all chars in type', function () {
    assert.deepEqual(param.parse('{*} $name - description'), { type: '*', name: 'name', description: '<p>description</p>\n' });
    assert.deepEqual(param.parse('{type|other} $name - description'), { type: 'type|other', name: 'name', description: '<p>description</p>\n' });
  });
});
