/* global describe, it */
'use strict';

var assert = require('assert');

describe('#requires', function(){
  var requires  = require('../requires.js');
  it('should default to function', function(){
    assert.deepEqual(requires('name - description'), { type : 'function', name : 'name', description : 'description', 'external': false });
    assert.deepEqual(requires('name description'), { type : 'function', name : 'name', description : 'description', 'external': false});
  });

  it('should work for variables with with or without $', function(){
    assert.deepEqual(requires('{variable} $my-variable'), { type : 'variable', name : 'my-variable', 'external': false});
    assert.deepEqual(requires('{variable} my-variable'),  { type : 'variable', name : 'my-variable', 'external': false});
  });

  it('should work with optional variable type if $ is used', function(){
    assert.deepEqual(requires('{variable} my-variable'), { type : 'variable', name : 'my-variable', 'external': false});
    assert.deepEqual(requires('$my-variable'), { type : 'variable', name : 'my-variable', 'external': false});
  });

  it('should work for external requires', function(){
    assert.deepEqual(requires('{variable} extern::lib'), { type : 'variable', name : 'extern::lib', 'external': true});
    assert.deepEqual(requires('extern::lib'), { type : 'function', name : 'extern::lib', 'external': true});
    assert.deepEqual(requires('$extern::lib'), { type : 'variable', name : 'extern::lib', 'external': true});
  });

  it('should work for external requires with url', function(){
    assert.deepEqual(requires('{variable} extern::lib - description <http://url.com>'),
                    {'type': 'variable', 'name': 'extern::lib', 'external':true, 'description': 'description', 'url': 'http://url.com'});
  });

  it('should work for name and url', function(){
    assert.deepEqual(requires('SassCore::map-has-key <http://sass-lang.com/documentation/Sass/Script/Functions.html#map_has_key-instance_method>'),
                    {'type': 'function', 'name': 'SassCore::map-has-key', 'external':true, 'url': 'http://sass-lang.com/documentation/Sass/Script/Functions.html#map_has_key-instance_method'});

  });
});


