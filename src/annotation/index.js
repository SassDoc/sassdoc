'use strict';

var fs = require('fs');
var path = require('path');

// This will hold all annotations read from ./annotation.
var annotations = {};

// This will hold each alias to each annotation.
var alias = {};

var endsWith = function (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

// Read all files from the annoation folder and add it to the annotations map.
fs.readdirSync(path.resolve(__dirname, './annotations')).forEach(function (file) {
  if (!endsWith(file, '.js')) {
    return;
  }

  var annotation = require(path.resolve(__dirname, 'annotations', file));
  var name = path.basename(file, '.js');

  alias[name] = name;

  if (Array.isArray(annotation.alias)) {
    annotation.alias.forEach(function (aliasName) {
      alias[aliasName] = name;
    });
  }

  annotations[name] =  annotation;
});

// Export the annotations and the alias map.
module.exports = annotations;
module.exports._ = {};
module.exports._.alias = alias;
