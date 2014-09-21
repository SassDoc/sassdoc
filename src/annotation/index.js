'use strict';

var fs = require('fs');
var path = require('path');

var endsWith = function (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var AnnotationsApi = function(){
  this.list = {
    _ : { alias : {} }
  };

  // Read all files from the annoation folder and add it to the annotations map.
  fs.readdirSync(path.resolve(__dirname, './annotations')).forEach(function (file) {
    if (!endsWith(file, '.js')) {
      return;
    }

    var annotation = require(path.resolve(__dirname, 'annotations', file));
    var name = path.basename(file, '.js');

    this.addAnnotation(name, annotation);
  }, this);
};

AnnotationsApi.prototype = {
  /**
   * Add a single annotation by name
   * @param {String} name - Name of the annotation
   * @param {Object} annotation - Annotation object
   */
  addAnnotation: function(name, annotation){
    this.list._.alias[name] = name;

    if (Array.isArray(annotation.alias)) {
      annotation.alias.forEach(function (aliasName) {
        this.list._.alias[aliasName] = name;
      }, this);
    }

    this.list[name] = annotation;
  },

  /**
   * Add an array of annotations. The name of the annoations must be
   * in the `name` key of the annoation.
   * @param {Array} annotations - Annotation objects
   */
  addAnnotations: function(annotations){
    if (annotations !== undefined){
      annotations.forEach(function(annotation){
        this.addAnnotation(annotation.name, annotation);
      }, this);
    }
  }
};


module.exports = AnnotationsApi;
