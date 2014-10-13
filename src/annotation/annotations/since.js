'use strict';

var sinceRegEx = /\s*([^\s]*)\s*(?:-?\s*([\s\S]*))?\s*$/;

module.exports = {
  parse: function (text) {
    var parsed = sinceRegEx.exec(text);
    var obj = {};

    if (parsed[1]) {
      obj.version = parsed[1];
    }

    if (parsed[2]) {
      obj.description = parsed[2];
    }

    return obj;
  }
};
