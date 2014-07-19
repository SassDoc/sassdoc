'use strict';
var marked = require('marked');

module.exports = function (text) {
  return marked(text.trim());
};