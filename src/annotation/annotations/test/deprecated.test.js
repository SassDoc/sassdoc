/* global describe, it */
'use strict';

var assert = require('assert');


describe('#deprecated', function(){
  var deprecated  = require('../deprecated.js');
  it('should return the trimmed string', function(){
    assert.equal(deprecated('   '), '');
    assert.equal(deprecated('   '), '');
    assert.equal(deprecated('\ntest\t'), 'test');
    assert.equal(deprecated('\nte\nst\t'), 'te\nst');
  });
});
