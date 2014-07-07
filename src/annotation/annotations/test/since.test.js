/* global describe, it */
'use strict';

var assert = require('assert');


describe('#since', function(){
  var since  = require('../since.js');
  it('should return the trimmed string', function(){
    assert.equal(since('   '), '');
    assert.equal(since('   '), '');
    assert.equal(since('\ntest\t'), 'test');
    assert.equal(since('\nte\nst\t'), 'te\nst');
  });
});
