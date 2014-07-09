'use strict';

var seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

module.exports = function (text) {
  var match = seeRegEx.exec(text);
  return {
    type : match[1] || 'function',
    name : match[2]
  };
};