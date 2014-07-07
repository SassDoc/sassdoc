/* global describe, it */
'use strict';

var assert = require('assert');


describe('#parameters', function(){
  var param  = require('../parameters.js');

  it('should return an object', function(){
    // needs fix-param
    // assert.deepEqual(param('{type} $hyphenated-name (default) - description'), { type : 'type', name :'hyphenated-name', default : 'default', description : 'description'});
    // assert.deepEqual(param('{type} $name (()) - description'), { type : 'type', name :'name', default : '()', description : 'description'});
    assert.deepEqual(param('{List} $list - list to check'), { type : 'List', name :'list', description : 'list to check'});
  });

});


