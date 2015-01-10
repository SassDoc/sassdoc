'use strict';

require('../init');

var assert = require('assert');

describe('#parameter', function () {
  var param = (new (require('../../dist/annotation'))()).list.parameter;

  it('should return an object', function () {
    assert.deepEqual(param.parse('{type} $hyphenated-name [default] - description'), { type: 'type', name: 'hyphenated-name', default: 'default', description: 'description' });
    assert.deepEqual(param.parse('{type} $name [default] - description [with brackets]'), { type: 'type', name: 'name', default: 'default', description: 'description [with brackets]' });
    assert.deepEqual(param.parse('{List} $list - list to check'), { type: 'List', name: 'list', description: 'list to check' });
  });

  it('should parse all chars in type', function () {
    assert.deepEqual(param.parse('{*} $name - description'), { type: '*', name: 'name', description: 'description' });
    assert.deepEqual(param.parse('{type|other} $name - description'), { type: 'type|other', name: 'name', description: 'description' });
  });

  it('should work for multiline description', function () {
    assert.deepEqual(param.parse('{type} $hyphenated-name [default] - description\nmore\nthan\none\nline'), { type: 'type', name: 'hyphenated-name', default: 'default', description: 'description\nmore\nthan\none\nline' });
  });

  it('should work without the $', function () {
    assert.deepEqual(param.parse('{type} hyphenated-name [default] - description\nmore\nthan\none\nline'), { type: 'type', name: 'hyphenated-name', default: 'default', description: 'description\nmore\nthan\none\nline' });
  });

});
