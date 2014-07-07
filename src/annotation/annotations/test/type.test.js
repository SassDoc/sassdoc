/* global describe, it */
'use strict';

var assert = require('assert');


describe('#type', function(){
  var type  = require('../type.js');
  it('should return the trimmed string', function(){
    assert.equal(type('   '), '');
    assert.equal(type('   '), '');
    assert.equal(type('\ntest\t'), 'test');
    assert.equal(type('\nte\nst\t'), 'te\nst');
  });
});
