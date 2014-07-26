/* global describe, it */
'use strict';

var assert = require('assert');

describe('#throws', function () {
  var _throws = require('../../src/annotation').throws;

  it('should return the trimmed string', function () {
    assert.equal(_throws.parse('   '), '');
    assert.equal(_throws.parse('   '), '');
    assert.equal(_throws.parse('\ntest\t'), '<p>test</p>\n');
    assert.equal(_throws.parse('\nte\nst\t'), '<p>te\nst</p>\n');
  });
});
