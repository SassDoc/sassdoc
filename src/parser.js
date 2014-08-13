'use strict';

var ScssCommentParser = require('scss-comment-parser');
var annotations = require('./annotation');

var parser = new ScssCommentParser(annotations);

module.exports = {

  parse: parser.parse.bind(parser),

  /**
   * Invoke the `resolve` function of an annotation if present.
   * Called with all found annotations excluding them from "unkown" type.
   */
  postProcess: function (data) {

    Object.keys(annotations).forEach(function (key) {
      var annotation = annotations[key];
      if (annotation.resolve) {
        annotation.resolve(data);
      }
    });

    return data;
  }
};
