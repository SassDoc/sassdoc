'use strict';

var reqRegEx = /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\((.*)\))?\s*(?:-?\s*([^<$]*))?\s*(?:<?\s*(.*)\s*>)?$/;
var utils = require('../../utils');

module.exports = function (text) {
  var match = reqRegEx.exec(text.trim());

  var obj = {
    type : match[1] || 'function',
    name : match[2]
  };

  obj.external = utils.splitNamespace(obj.name).length > 1;

  if (obj.name.indexOf('$') === 0){
    obj.type = 'variable';
    obj.name = obj.name.slice(1);
  }

  if (match[4]){
    obj.description = match[4].trim();
  }

  if (match[5]){
    obj.url = match[5];
  }

  return obj;
};