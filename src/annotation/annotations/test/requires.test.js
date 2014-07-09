/* global describe, it */
'use strict';

var assert = require('assert');

describe('#requires', function(){
  var requires  = require('../requires.js');
  it('should default to function', function(){
    assert.deepEqual(requires('name'), { type : 'function', name : 'name'});
  });

  it('should work for variables with with or without $', function(){
    assert.deepEqual(requires('{variable} $my-variable'), { type : 'variable', name : 'my-variable'});
    assert.deepEqual(requires('{variable} my-variable'),  { type : 'variable', name : 'my-variable'});
  });

  it('should work with optional variable type if $ is used', function(){
    assert.deepEqual(requires('{variable} my-variable'), { type : 'variable', name : 'my-variable'});
    assert.deepEqual(requires('$my-variable'), { type : 'variable', name : 'my-variable'});
  });
});


