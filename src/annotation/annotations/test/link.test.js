/* global describe, it */
'use strict';

var assert = require('assert');

describe('#link', function(){
  var link  = require('../link.js');
  it('should return an object', function(){
    assert.deepEqual(link(''), { url : '', caption : ''});
  });

  it('should work with funny spaces and linebreaks', function(){
    assert.deepEqual(link('\t\n\nhttp://sass.com    \t\n\n'), { url : 'http://sass.com', caption : ''});
  });

  it('should return the caption optionally', function(){
    assert.deepEqual(link('http://sass.com'), { url : 'http://sass.com', caption : ''});
    assert.deepEqual(link('caption'), { url : '', caption : 'caption'});
    assert.deepEqual(link('http://sass.com caption'), { url : 'http://sass.com', caption : 'caption'});
    assert.deepEqual(link('http://sass.com multiple words caption'), { url : 'http://sass.com', caption : 'multiple words caption'});
  });
});


