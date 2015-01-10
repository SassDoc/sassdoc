'use strict';

require('../init');

var assert = require('assert');

describe('#example', function () {
  var example = (new (require('../../dist/annotation'))()).list.example;

  it('default type should be `scss`', function () {
    assert.deepEqual(example.parse(''), { type: 'scss', code: '' });
    assert.deepEqual(example.parse('\n'), { type: 'scss', code: '' });
    assert.deepEqual(example.parse('some code'), { type: 'scss', code: 'some code' });
  });

  it('should remove leading linebreaks', function () {
    assert.deepEqual(example.parse('\nsome code\n'), { type: 'scss', code: 'some code' });
  });

  it('should extract type and description from first line', function () {
    assert.deepEqual(example.parse('type\nsome code'), { type: 'type', code: 'some code' });
    assert.deepEqual(example.parse('type - description\nsome code'), { type: 'type', description: 'description', code: 'some code' });
    assert.deepEqual(example.parse('type description\nsome code'), { type: 'type', description: 'description', code: 'some code' });
  });

});
