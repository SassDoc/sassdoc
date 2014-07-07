/* global describe, it */
'use strict';

var assert = require('assert');

describe('#requires', function(){
  var requires  = require('../requires.js');
  it('should default to function', function(){
    assert.deepEqual(requires('name'), { type : 'function', name : 'name'});
  });
});


