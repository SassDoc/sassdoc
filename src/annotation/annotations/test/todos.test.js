/* global describe, it */
'use strict';

var assert = require('assert');


describe('#throws', function(){
  var todos  = require('../todos.js');
  it('should return the trimmed string', function(){
    assert.equal(todos('   '), '');
    assert.equal(todos('   '), '');
    assert.equal(todos('\ntest\t'), 'test');
    assert.equal(todos('\nte\nst\t'), 'te\nst');
  });
});
