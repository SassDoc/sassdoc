let utils = require('./utils');
let errors = require('./errors');
let is = utils.is;

let Environment = require('./environment').default;
let Logger = require('./logger').default;
let Parser = require('./parser').default;
let exclude = require('./exclude').default;
let recurse = require('./recurse').default;
let sorter = require('./sorter').default;

let difference = require('lodash.difference');
let fs = require('fs');
let path = require('path');
let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let vfs = require('vinyl-fs');
let converter = require('sass-convert');
let pipe = require('multipipe'); // jshint ignore:line

/**
 * @return {Stream}
 */
export function parseFilter(env = {}) {
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

  let logger = config.logger || new Logger(config.verbose, process.env.SASSDOC_DEBUG);
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
 * @see srcEnv
 */
export default function sassdoc(...args) {
  return srcEnv(documentize, stream)(...args);

  /**
   * @return {Promise}
   */
  async function documentize(env) { // jshint ignore:line
    let data = await baseDocumentize(env);

    try {
      await refresh(env);
      await theme(env);
      okay(env);
    } catch (err) {
      env.emit('error', err);
      throw err;
    }

    return data;
  }

  /**
   * Safely wipe and re-create the destination dir.
   */
  function refresh(env) { // jshint ignore:line
    return safeWipe(env.dest, {
      force: true,
      parent: is.string(env.src) ? utils.g2b(env.src) : null,
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
  function theme(env) { // jshint ignore:line
    let promise = env.theme(env.dest, env);

    if (!is.promise(promise)) {
      let type = Object.prototype.toString.call(promise);
      throw new errors.Error(`Theme didn't return a promise, got ${type}.`);
    }

    return promise
      .then(() => {
        let themeName = env.themeName || 'anonymous';
        env.logger.log(`Theme "${themeName}" successfully rendered.`);
      });
  }

  /**
   * Pipe SassDoc to Vinyl files streams.
   *
   * @return {Stream}
   */
  function stream(env) {
    let filter = parseFilter(env);

    /* jshint ignore:start */

    let documentize = async () => {

      try {
        await refresh(env);
        await filter.promise;
        await theme(env);
      } catch (err) {
        env.emit('error', err);
        throw err;
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

/**
 * @param {String} src
 * @param {Object} env
 * @see srcEnv
 */
export function parse(...args) {
  return srcEnv(documentize, parseFilter)(...args);

  async function documentize(env) {
    let data = await baseDocumentize(env);
    okay(env);

    return data;
  }
}

async function baseDocumentize(env) {
  let filter = parseFilter(env);

  filter.promise
    .then(data => {
      env.logger.log(`Folder "${env.src}" successfully parsed.`);
      env.data = data;

      env.logger.debug(() => {
        fs.writeFile(
          'sassdoc-data.json',
          JSON.stringify(data, null, 2)
        );

        return 'Dumping data to "sassdoc-data.json".';
      });
    });


  let streams = [ // jshint ignore:line
    vfs.src(env.src),
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
    await pipeline();
  } catch (err) {
    env.emit('error', err);
    throw err;
  }

  return env.data;
}

/**
 * Return a function taking optional `src` string or array, and optional
 * `env` object (arguments are found by their type).
 *
 * If `src` is set, proxy to `documentize`, otherwise `stream`.
 *
 * Both functions will be passed the `env` object, which will have a
 * `src` key.
 */
function srcEnv(documentize, stream) {
  return function (...args) {
    let src = args.find(a => is.string(a) || is.array(a));
    let env = args.find(is.object);

    env = ensureEnvironment(env || {});

    env.logger.debug('process.argv:', () => JSON.stringify(process.argv));
    env.logger.debug('sassdoc version:', () => require('../package.json').version);
    env.logger.debug('node version:', () => process.version.substr(1));

    env.logger.debug('npm version:', () => {
      let prefix = path.resolve(process.execPath, '../../lib');
      let pkg = path.resolve(prefix, 'node_modules/npm/package.json');

      try {
        return require(pkg).version;
      } catch (e) {
        return 'unknown';
      }
    });

    env.logger.debug('platform:', () => process.platform);
    env.logger.debug('cwd:', () => process.cwd());

    env.src = src;
    env.dest = env.dest || 'sassdoc';

    env.logger.debug('env:', () => {
      let clone = {};

      difference(
        Object.getOwnPropertyNames(env),
        ['domain', '_events', '_maxListeners', 'logger']
      )
        .forEach(k => clone[k] = env[k]);

      return JSON.stringify(clone, null, 2);
    });

    let task = env.src ? documentize : stream;
    env.logger.debug('task:', () => task.name);

    return task(env);
  };
}

/**
 * Log success message.
 */
function okay(env) {
  env.logger.log('Process over. Everything okay!');
}
