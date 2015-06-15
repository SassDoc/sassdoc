'use strict';

var assert = require('assert');

describe('#return', function () {
  var returnsCtor = require('../../dist/annotation/annotations/return');
  var returns = returnsCtor(require('./envMock'));

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

  it('should work without description', function () {
    assert.deepEqual(returns.parse('{type}'), { type: 'type' });
  });

  it('should fail without type', function (done) {
    var ret = returnsCtor({
      logger: {
        warn: function (msg) {
          assert.equal(msg, '@return must at least have a type. Location: FileID:1:2');
          done();
        },
      },
    });
    assert.deepEqual(ret.parse('', { commentRange: { start: 1, end: 2 }}, 'FileID'), undefined);
  });
});
