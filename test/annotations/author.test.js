/* global describe, it */
'use strict';

var assert = require('assert');

describe('#author', function () {
  var author = (new (require('../../src/annotation'))()).list.author;

  it('should return the trimmed string', function () {
    assert.equal(author.parse('   '), '');
    assert.equal(author.parse('   '), '');
    assert.equal(author.parse('\ntest\t'), 'test');
    assert.equal(author.parse('\nte\nst\t'), 'te\nst');
  });
});
