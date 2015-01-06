let utils = require('./utils');
let errors = require('./errors');
let is = utils.is;

let Environment = require('./environment').default;
let Logger = require('./logger').default;
let Parser = require('./parser').default;
let exclude = require('./exclude').default;
let recurse = require('./recurse').default;
let sort = require('./sorter').default;

let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let vfs = require('vinyl-fs');
let through = require('through2');
let converter = require('sass-convert');
let pipe = require('multipipe');

export default class SassDoc {

  /**
   * @param {String} src
   * @param {Object} env
   */
  constructor(src, env = {}) {
    if (!(this instanceof SassDoc)) {
      return new SassDoc(src, env);
    }

    this.env = ensureEnvironment(env, Promise.reject);
    this.logger = this.env.logger;
    this.dest = this.env.dest || 'sassdoc';
    this.src = src;
    this.pipeline = through.obj();
  }

  /**
   * Safely wipe and re-create the destination dir.
   */
  refresh() {
    return safeWipe(this.dest, {
      force: true,
      parent: utils.g2b(this.src),
      silent: true,
    })
      .then(() => mkdir(this.dest))
      .then(() => {
        this.logger.log(`Folder "${this.dest}" successfully refreshed.`);
      })
      .catch(err => {
        // Friendly error for already existing directory.
        throw new errors.Error(err.message);
      });
  }

  /**
   * Render theme with parsed data.
   */
  theme() {
    let promise = this.env.theme(this.dest, this.env);

    if (!is.promise(promise)) {
      let type = Object.prototype.toString.call(promise);
      throw new errors.Error(`Theme didn't return a promise, got ${type}.`);
    }

    return promise
      .then(() => {
        let themeName = this.env.themeName || 'anonymous';
          this.logger.log(`Theme "${themeName}" successfully rendered.`);
          this.logger.log('Process over. Everything okay!');
      });
  }

  /**
   * Read, recurse, convert the source dir.
   */
  readSource() {
    let deferred = utils.defer();

    let streams = [
      vfs.src(this.src),
      recurse(),
      exclude(this.env.exclude || []),
      converter({ from: 'sass', to: 'scss' })
    ];

    this.pipeline = pipe(...streams, err => {
      if (err) {
        return deferred.reject(err);
      }

      deferred.resolve();
    });

    return deferred.promise;
  }

  /**
   * Parse files and process the data.
   */
  parse() {
    let filter = parseFilter(this.src, this.env);

    this.pipeline.pipe(filter).resume();

    return filter.promise
    .then(data => {
      this.logger.log(`Folder "${this.src}" successfully parsed.`);
      this.env.data = data;
    });
  }

  /**
   * All in one method.
   */
  documentize() {
    return this.refresh()
      .then(() => this.readSource())
      .then(() => this.parse())
      .then(() => this.theme())
      .catch(err => {
        this.env.emit('error', err);
      });
  }

  /**
   * Pipe SassDoc into Vinyl files pipelines.
   */
  stream() {
    this.refresh()
      .then(() => this.parse())
      .then(() => this.theme())
      .catch(err => {
        this.env.emit('error', err);
      });

    return this.pipeline;
  }
}

export function parseFilter(src, env = {}) {
  env = ensureEnvironment(env, Promise.reject);

  let parser = new Parser(env, env.theme && env.theme.annotations);
  let filter = parser.stream();

  filter.promise
    .then(data => sort(data));

  return filter;
}

export function ensureEnvironment(config, onError) {
  if (config instanceof Environment) {
    config.on('error', onError);
    return config;
  }

  let logger = new Logger(config.verbose);
  let env = new Environment(logger, config.strict);

  env.on('error', onError);
  env.load(config);
  env.postProcess();

  return env;
}

// Re-export, expose API.
export { Environment, Logger, errors };
