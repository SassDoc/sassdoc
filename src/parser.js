'use strict';
var ScssCommentParser = require('scsscommentparser');
var annotations = require('./annotation');
module.exports = new ScssCommentParser( annotations);
