let AnnotationsApi = require('./annotation').default;
let ScssCommentParser = require('scss-comment-parser');
let through = require('through2');
let path = require('path');
let utils = require('./utils');

export default class Parser {
  constructor(config, additionalAnnotations) {
    this.annotations = new AnnotationsApi(config);
    this.annotations.addAnnotations(additionalAnnotations);
    this.scssParser = new ScssCommentParser(this.annotations.list, config);

    this.scssParser.commentParser.on('warning', warning => {
      config.logger.warn(warning);
    });
  }

  parse(code, id) {
    return this.scssParser.parse(code, id);
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

  /**
   * Return a transform stream meant to be piped in a stream of SCSS
   * files. Each file will be passed-through as-is, but they are all
   * parsed to generate a SassDoc data array.
   *
   * The returned stream has an additional `promise` property, containing
   * a `Promise` object that will be resolved when the stream is done and
   * the data is fulfiled.
   *
   * @param {Object} parser
   * @return {Object}
   */
  stream() {
    let data = [];
    let deferred = utils.defer();

    let transform = (chunk, enc, cb) => {
      // Pass-through.
      cb(null, chunk);

      if (!chunk.isBuffer()) {
        return;
      }
      var name = path.basename(chunk.relative);
      let fileData = this.parse(chunk.contents.toString(enc), name);

      fileData.forEach(item => {
        item.file = {
          path: chunk.relative,
          name: name,
        };

        data.push(item);
      });
    };

    let flush = cb => {
      data = data.filter(item => item.context.type !== 'unknown');
      data = this.postProcess(data);

      deferred.resolve(data);
      cb();
    };

    let filter = through.obj(transform, flush);
    filter.promise = deferred.promise;

    return filter;
  }
}
