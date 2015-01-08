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

/**
 * @param {String} src
 * @param {Object} env
 */
export default function sassdoc(...args) {
  let src = args.find(is.string);
  let env = args.find(is.object);
  let hasSrc = src;

  env = ensureEnvironment(env || {});
  src = src || process.cwd();
  env.dest = env.dest || 'sassdoc';

  return hasSrc ? documentize() : stream();

  /**
   * Safely wipe and re-create the destination dir.
   */
  function refresh() { // jshint ignore:line
    return safeWipe(env.dest, {
      force: true,
      parent: utils.g2b(src),
      silent: true,
    })
      .then(() => mkdir(env.dest))
      .then(() => {
        env.logger.log(`Folder "${env.dest}" successfully refreshed.`);
      })
      .catch(err => {
        // Friendly error for already existing directory.
        throw new errors.Error(err.message);
      });
  }

  /**
   * Render theme with parsed data.
   */
  function theme() { // jshint ignore:line
    let promise = env.theme(env.dest, env);

    if (!is.promise(promise)) {
      let type = Object.prototype.toString.call(promise);
      throw new errors.Error(`Theme didn't return a promise, got ${type}.`);
    }

    return promise
      .then(() => {
        let themeName = env.themeName || 'anonymous';
        env.logger.log(`Theme "${themeName}" successfully rendered.`);
        env.logger.log('Process over. Everything okay!');
      });
  }

  /**
   * All in one method.
   *
   * @return {Promise}
   */
  async function documentize() { // jshint ignore:line
    let filter = parseFilter(src, env);

    filter.promise
      .then(data => {
        env.logger.log(`Folder "${src}" successfully parsed.`);
        env.data = data;
      });

    let streams = [ // jshint ignore:line
      vfs.src(src),
      recurse(),
      exclude(env.exclude || []),
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
      await refresh();
      await pipeline();
      await theme();
    } catch (err) {
      env.emit('error', err);
    }

    /* jshint ignore:end */
  }

  /**
   * Pipe SassDoc to Vinyl files streams.
   *
   * @return {Stream}
   */
  function stream() {
    let filter = parseFilter(src, env);

    /* jshint ignore:start */

    let documentize = async () => {
      try {
        await refresh();
        await filter.promise;
        await theme();
      } catch (err) {
        env.emit('error', err);
      }
    };

    filter
      .on('pipe', documentize)
      .on('error', err => env.emit('error', err))
      .resume(); // Drain.

    /* jshint ignore:end */

    filter.promise
      .then(data => {
        env.logger.log('SCSS files successfully parsed.');
        env.data = data;
      });

    return filter;
  }
}
