'use strict';

var logger = require('./log');

var AnnotationApi = require('./annotation');
var ScssCommentParser = require('scss-comment-parser');

var Parser = function(config){
  this.annotations = new AnnotationApi();
  this.scssParser = new ScssCommentParser(this.annotations.list, config);

  this.scssParser.commentParser.on('warning', function (warning) {
    logger.warn(warning);
  });
};

Parser.prototype = {

  parse: function(){
    return this.scssParser.parse.apply(this.scssParser, arguments);
  },

  /**
   * Invoke the `resolve` function of an annotation if present.
   * Called with all found annotations except with type "unkown".
   */
  postProcess: function(data){
    Object.keys(this.annotations.list).forEach(function (key) {
      var annotation = this.annotations.list[key];
      if (annotation.resolve) {
        annotation.resolve(data);
      }
    }, this);

    return data;
  }
};

module.exports = Parser;
