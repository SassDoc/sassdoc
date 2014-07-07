/* global describe, it */
'use strict';

var assert = require('assert');


describe('#throws', function(){
  var _throws  = require('../throws.js');
  it('should return the trimmed string', function(){
    assert.equal(_throws('   '), '');
    assert.equal(_throws('   '), '');
    assert.equal(_throws('\ntest\t'), 'test');
    assert.equal(_throws('\nte\nst\t'), 'te\nst');
  });
});
