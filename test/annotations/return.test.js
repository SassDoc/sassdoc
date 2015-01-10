'use strict';

require('../init');

var assert = require('assert');

describe('#return', function () {
  var returns = (new (require('../../dist/annotation'))()).list.return;

  it('should return an object', function () {
    assert.deepEqual(returns.parse('{List} - list to check'), { type: 'List', description: 'list to check' });
  });

  it('should parse all chars in type', function () {
    assert.deepEqual(returns.parse('{*} - description'), { type: '*', description: 'description' });
    assert.deepEqual(returns.parse('{type|other} - description'), { type: 'type|other', description: 'description' });
  });

  it('should work for multiline description', function () {
    assert.deepEqual(returns.parse('{type} - description\nmore\nthan\none\nline'), { type: 'type', description: 'description\nmore\nthan\none\nline' });
  });
});
