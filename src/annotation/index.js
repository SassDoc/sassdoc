import annotations from './annotations'

export default class AnnotationsApi {
  constructor (env) {
    this.env = env

    this.list = {
      _: { alias: {} }
    }

    this.addAnnotations(annotations)
  }

  /**
   * Add a single annotation by name
   * @param {String} name - Name of the annotation
   * @param {Object} annotation - Annotation object
   */
  addAnnotation (name, annotation) {
    annotation = annotation(this.env)

    this.list._.alias[name] = name

    if (Array.isArray(annotation.alias)) {
      annotation.alias.forEach(aliasName => {
        this.list._.alias[aliasName] = name
      })
    }

    this.list[name] = annotation
  }

  /**
   * Add an array of annotations. The name of the annotations must be
   * in the `name` key of the annotation.
   * @param {Array} annotations - Annotation objects
   */
  addAnnotations (annotations) {
    if (annotations !== undefined) {
      annotations.forEach(annotation => {
        this.addAnnotation(annotation().name, annotation)
      })
    }
  }
}
