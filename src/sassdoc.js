let utils = require('./utils');
let errors = require('./errors');
let is = utils.is;

let Environment = require('./environment').default;
let Logger = require('./logger').default;
let Parser = require('./parser').default;
let exclude = require('./exclude').default;
let recurse = require('./recurse').default;
let sorter = require('./sorter').default;

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
  constructor(...args) {
    if (!(this instanceof SassDoc)) {
      return new SassDoc(...args);
    }

    let src = args.find(e => is.string(e));
    let env = args.find(e => is.object(e));

    this.env = ensureEnvironment(env || {}, Promise.reject);
    this.logger = this.env.logger;
    this.src = src || process.cwd();
    this.dest = this.env.dest || 'sassdoc';
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
   * All in one method.
   * @return {Promise}
   */
  async documentize() {
    let filter = parseFilter(this.src, this.env);

    filter.promise
      .then(data => {
        this.logger.log(`Folder "${this.src}" successfully parsed.`);
        this.env.data = data;
      });

    let streams = [
      vfs.src(this.src),
      recurse(),
      exclude(this.env.exclude || []),
      converter({ from: 'sass', to: 'scss' }),
      filter
    ];

    let pipeline = () => {
      return new Promise((resolve, reject) => {
        pipe(...streams, err => {
          err ? reject(err) : resolve();
        })
        .on('data', noop); // Drain.
      });
    };

    try {
      await this.refresh();
      await pipeline();
      await this.theme();
    } catch (err) {
      this.env.emit('error', err);
    }
  }

  /**
   * Pipe SassDoc to Vinyl files streams.
   * @return {Stream}
   */
  stream() {
    let filter = parseFilter(this.src, this.env);

    let documentize = async () => {
      try {
        await this.refresh();
        await filter.promise;
        await this.theme();
      } catch (err) {
        this.env.emit('error', err);
      }
    };

    filter
      .on('pipe', documentize)
      .on('data', noop) // Drain.
      .on('error', err => this.env.emit('error', err));

    filter.promise
      .then(data => {
        this.logger.log('SCSS files successfully parsed.');
        this.env.data = data;
      });

    return filter;
  }
}

/**
 * @return {Stream}
 */
export function parseFilter(src, env = {}) {
  env = ensureEnvironment(env, Promise.reject);

  let parser = new Parser(env, env.theme && env.theme.annotations);
  let filter = parser.stream();

  filter.promise
    .then(data => sorter(data));

  return filter;
}

/**
 * @return {Object}
 */
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

let noop = () => {};
let passThrough = () => through.obj();

/**
* Re-export, expose API.
*/
export { Environment, Logger, Parser, sorter, errors };
