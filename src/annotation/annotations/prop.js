'use strict';

var reqRegEx = /\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\(([^\)]*)\))?\s*(?:-?\s*([\s\S]*))\s*$/;

module.exports = {

  parse: function (text) {
    var match = reqRegEx.exec(text.trim());

    var obj = {
      type: match[1] || 'Map'
    };

    if (match[2]) {
      obj.name = match[2];
    }

    if (match[3]) {
      obj.default = match[3];
    }

    if (match[4]) {
      obj.description = match[4];
    }

    return obj;
  },

  alias: ['property'],

  allowedOn: ['variable']
};
