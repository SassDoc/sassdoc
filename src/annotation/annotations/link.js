'use strict';

var linkRegex = /\s*([^:]+\:\/\/[^\s]*)?\s*(.*?)$/;

module.exports = function (text) {
  var parsed = linkRegex.exec(text.trim());

  return {
    url: parsed[1] || '',
    caption: parsed[2] || ''
  };
};