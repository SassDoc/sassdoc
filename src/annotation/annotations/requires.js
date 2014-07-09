'use strict';

var reqRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;
module.exports = function (text) {
  var match = reqRegEx.exec(text);

  var type = match[1] || 'function';
  var name = match[2];

  if (name.indexOf('$') === 0){
    type = 'variable';
    name = name.slice(1);
  }


  return {
    type : type,
    name : name
  };
};