let AnnotationApi = require('./annotation');
let ScssCommentParser = require('scss-comment-parser');

export default class Parser {
  constructor (config) {
    this.annotations = new AnnotationApi();
    this.scssParser = new ScssCommentParser(this.annotations.list, config);

    this.scssParser.commentParser.on('warning', (warning) => {
      config.logger.warn(warning);
    });
  }

  parse(...args) {
    return this.scssParser.parse(args);
  }

  /**
   * Invoke the `resolve` function of an annotation if present.
   * Called with all found annotations except with type "unkown".
   */
  postProcess(data) {
    Object.keys(this.annotations.list).forEach(key => {
      let annotation = this.annotations.list[key];
      if (annotation.resolve) {
        annotation.resolve(data);
      }
    });

    return data;
  }
}
