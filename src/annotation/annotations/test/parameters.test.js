/* global describe, it */
'use strict';

var assert = require('assert');


describe('#parameters', function(){
  var param  = require('../parameters.js');

  it('should return an object', function(){
    assert.deepEqual(param('{type} $hyphenated-name (default) - description'), { type : 'type', name :'hyphenated-name', default : 'default', description : 'description'});
    assert.deepEqual(param('{type} $name (()) - description'), { type : 'type', name :'name', default : '()', description : 'description'});
    assert.deepEqual(param('{List} $list - list to check'), { type : 'List', name :'list', description : 'list to check'});
  });

  it('should parse all chars in type', function(){
    assert.deepEqual(param('{*} $name - description'), { type : '*', name :'name', description : 'description'});
    assert.deepEqual(param('{type|other} $name - description'), { type : 'type|other', name :'name', description : 'description'});
  });

});


