'use strict'

var assert = require('assert')

describe('#AnnotationsApi', function () {
  var AnnotationsApi = require('../../dist/annotation').default
  var api = new AnnotationsApi()

  it('should include the right number of annotations', function () {
    assert.equal(
      Object.keys(api.list).length,
      21
    )
  })
})
