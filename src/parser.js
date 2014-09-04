'use strict';

var ScssCommentParser = require('scss-comment-parser');
var annotations = require('./annotation');

var logger = require('./log');

var parser = new ScssCommentParser(annotations);

parser.commentParser.on('warning', function (warning) {
  logger.warn(warning);
});

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
