'use strict';

var reqRegEx = /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\((.*)\))?\s*(?:-?\s*(.*))?$/;
module.exports = function (text) {
  var match = reqRegEx.exec(text);

  var obj = {
    type : match[1] || 'function',
    name : match[2]
  };

  if (obj.name.indexOf('$') === 0){
    obj.type = 'variable';
    obj.name = obj.name.slice(1);
  }

  if (match[4]){
    obj.description = match[4];
  }

  return obj;
};