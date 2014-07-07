/* global describe, it */
'use strict';

var assert = require('assert');

describe('#author', function(){
  var author  = require('../author.js');
  it('should return the trimmed string', function(){
    assert.equal(author('   '), '');
    assert.equal(author('   '), '');
    assert.equal(author('\ntest\t'), 'test');
    assert.equal(author('\nte\nst\t'), 'te\nst');
  });
});
