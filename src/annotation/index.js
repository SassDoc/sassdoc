import access from './annotations/access';
import alias from './annotations/alias';
import author from './annotations/author';
import content from './annotations/content';
import deprecated from './annotations/deprecated';
import example from './annotations/example';
import group from './annotations/group';
import ignore from './annotations/ignore';
import link from './annotations/link';
import output from './annotations/output';
import parameter from './annotations/parameter';
import property from './annotations/property';
import require_ from './annotations/require';
import return_ from './annotations/return';
import see from './annotations/see';
import since from './annotations/since';
import throw_ from './annotations/throw';
import todo from './annotations/todo';
import type from './annotations/type';

export default class AnnotationsApi {
  constructor(config) {
    this.config = config;
    this.list = {
      _: { alias: {} }
    };

    this.addAnnotation('access', access);
    this.addAnnotation('alias', alias);
    this.addAnnotation('author', author);
    this.addAnnotation('content', content);
    this.addAnnotation('deprecated', deprecated);
    this.addAnnotation('example', example);
    this.addAnnotation('group', group);
    this.addAnnotation('ignore', ignore);
    this.addAnnotation('link', link);
    this.addAnnotation('output', output);
    this.addAnnotation('parameter', parameter);
    this.addAnnotation('property', property);
    this.addAnnotation('require', require_);
    this.addAnnotation('return', return_);
    this.addAnnotation('see', see);
    this.addAnnotation('since', since);
    this.addAnnotation('throw', throw_);
    this.addAnnotation('todo', todo);
    this.addAnnotation('type', type);
  }

  /**
   * Add a single annotation by name
   * @param {String} name - Name of the annotation
   * @param {Object} annotation - Annotation object
   */
  addAnnotation(name, annotation) {
    annotation = annotation(this.config);

    this.list._.alias[name] = name;

    if (Array.isArray(annotation.alias)) {
      annotation.alias.forEach(aliasName => {
        this.list._.alias[aliasName] = name;
      });
    }

    this.list[name] = annotation;
  }

  /**
   * Add an array of annotations. The name of the annotations must be
   * in the `name` key of the annotation.
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
