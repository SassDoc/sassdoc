'use strict';

var marked = require('marked');

module.exports = {
  parse : function (text) {
    return marked(text.trim());
  }
};

module.exports.alias = ['throw', 'exception'];
