/* global describe, it */
'use strict';

var assert = require('assert');

describe('#see', function(){
  var requires  = require('../see.js');
  it('should default to function', function(){
    assert.deepEqual(requires('name'), { type : 'function', name : 'name'});
  });
});


