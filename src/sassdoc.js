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
let converter = require('sass-convert');
let pipe = require('multipipe'); // jshint ignore:line

class SassDoc {

  /**
   * @param {String} src
   * @param {Object} env
   */
  constructor(...args) {
    if (!(this instanceof SassDoc)) {
      return new SassDoc(...args);
    }

    let src = args.find(is.string);
    let env = args.find(is.object);

    this.env = ensureEnvironment(env || {});
    this.logger = this.env.logger;
    this.src = src || process.cwd();
    this.dest = this.env.dest || 'sassdoc';

    if (src) {
      return this.documentize();
    }

    return this.stream();
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
  async documentize() { // jshint ignore:line
    let filter = parseFilter(this.src, this.env);

    filter.promise
      .then(data => {
        this.logger.log(`Folder "${this.src}" successfully parsed.`);
        this.env.data = data;
      });



    let streams = [ // jshint ignore:line
      vfs.src(this.src),
      recurse(),
      exclude(this.env.exclude || []),
      converter({ from: 'sass', to: 'scss' }),
      filter
    ];

    /* jshint ignore:start */

    let pipeline = () => {
      return new Promise((resolve, reject) => {
        pipe(...streams, err => {
          err ? reject(err) : resolve();
        })
        .resume(); // Drain.
      });
    };

    try {
      await this.refresh();
      await pipeline();
      await this.theme();
    } catch (err) {
      this.env.emit('error', err);
    }

    /* jshint ignore:end */
  }

  /**
   * Pipe SassDoc to Vinyl files streams.
   * @return {Stream}
   */
  stream() {
    let filter = parseFilter(this.src, this.env);

    /* jshint ignore:start */

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
      .on('error', err => this.env.emit('error', err))
      .resume(); // Drain.

    /* jshint ignore:end */

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
  env = ensureEnvironment(env);

  let parser = new Parser(env, env.theme && env.theme.annotations);
  let filter = parser.stream();

  filter.promise
    .then(data => sorter(data));

  return filter;
}

/**
 * @return {Object}
 */
export function ensureEnvironment(config, onError = e => { throw e; }) {
  if (config instanceof Environment) {
    config.on('error', onError);
    return config;
  }

  let logger = config.logger || new Logger(config.verbose);
  let env = new Environment(logger, config.strict);

  env.on('error', onError);
  env.load(config);
  env.postProcess();

  return env;
}

/**
* Expose API.
*/
export { Environment, Logger, Parser, sorter, errors };

export default function sassdoc(...args) {
  return new SassDoc(...args);
}
