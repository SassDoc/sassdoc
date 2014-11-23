let AnnotationsApi = require('./annotation').default;
let ScssCommentParser = require('scss-comment-parser');

export default class Parser {
  constructor(config, additionalAnnotations) {
    this.annotations = new AnnotationsApi(config);
    this.annotations.addAnnotations(additionalAnnotations);
    this.scssParser = new ScssCommentParser(this.annotations.list, config);

    this.scssParser.commentParser.on('warning', warning => {
      config.logger.warn(warning);
    });
  }

  parse(code) {
    return this.scssParser.parse(code);
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
