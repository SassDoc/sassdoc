'use strict';

var ScssCommentParser = require('scss-comment-parser');
var annotations = require('./annotation');

module.exports = new ScssCommentParser(annotations);
