/* global describe, it */
'use strict';

var assert = require('assert');

describe('#prop', function () {
  var prop = require('../../src/annotation').prop;

  it('should parse the prop annotation', function () {
    assert.deepEqual(prop.parse('base'), {
      type : 'Map',
      path : 'base'
    });

    assert.deepEqual(prop.parse('{Function} base.default - description'), {
      type : 'Function',
      path : 'base.default',
      description : 'description'
    });

    assert.deepEqual(prop.parse('{Function} base.default - description'), {
      type : 'Function',
      path : 'base.default',
      description : 'description'
    });

    assert.deepEqual(prop.parse('{Function} base.default (default) - description'), {
      type : 'Function',
      path : 'base.default',
      default : 'default',
      description : 'description'
    });
  });
});
