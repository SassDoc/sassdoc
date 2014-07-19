/* global describe, it */
'use strict';

var assert = require('assert');

describe('#author', function(){
  var author  = require('../author.js');
  it('should return the trimmed string', function(){
    assert.equal(author('   '), '');
    assert.equal(author('   '), '');
    assert.equal(author('\ntest\t'), '<p>test</p>\n');
    assert.equal(author('\nte\nst\t'), '<p>te\nst</p>\n');
  });
});
