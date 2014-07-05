'use strict';

var reqRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;
module.exports = function (text) {
  var match = reqRegEx.exec(text);
  return {
    type : match[1] || 'function',
    name : match[2]
  };
};