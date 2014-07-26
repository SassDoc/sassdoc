/* global describe, it */
'use strict';

var assert = require('assert');

describe('#author', function () {
  var author = require('../../src/annotation').author;

  it('should return the trimmed string', function () {
    assert.equal(author.parse('   '), '');
    assert.equal(author.parse('   '), '');
    assert.equal(author.parse('\ntest\t'), '<p>test</p>\n');
    assert.equal(author.parse('\nte\nst\t'), '<p>te\nst</p>\n');
  });
});
