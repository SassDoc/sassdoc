let fs = require('fs');
let path = require('path');

export default class AnnotationsApi {
  constructor() {
    this.list = {
      _ : { alias: {} }
    };

    // Read all files from the annoation folder and add it to the annotations map.
    fs.readdirSync(path.resolve(__dirname, './annotations')).forEach(file => {
      if (!endsWith(file, '.js')) {
        return;
      }

      var annotation = require(path.resolve(__dirname, 'annotations', file));
      var name = path.basename(file, '.js');

      this.addAnnotation(name, annotation);
    });
  }

  /**
   * Add a single annotation by name
   * @param {String} name - Name of the annotation
   * @param {Object} annotation - Annotation object
   */
  addAnnotation(name, annotation) {
    this.list._.alias[name] = name;

    if (Array.isArray(annotation.alias)) {
      annotation.alias.forEach(aliasName => {
        this.list._.alias[aliasName] = name;
      });
    }

    this.list[name] = annotation;
  }

  /**
   * Add an array of annotations. The name of the annoations must be
   * in the `name` key of the annoation.
   * @param {Array} annotations - Annotation objects
   */
  addAnnotations(annotations) {
    if (annotations !== undefined) {
      annotations.forEach(annotation => {
        this.addAnnotation(annotation.name, annotation);
      });
    }
  }
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
