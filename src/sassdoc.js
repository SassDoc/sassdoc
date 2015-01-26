const { denodeify, is, g2b } = require('./utils');

const Environment = require('./environment');
const Logger = require('./logger');
const Parser = require('./parser');
const errors = require('./errors');
const sorter = require('./sorter');
const exclude = require('./exclude');
const recurse = require('./recurse');

const fs = require('fs');
const path = require('path'); // jshint ignore:line
const difference = require('lodash.difference'); // jshint ignore:line
const mkdir = denodeify(require('mkdirp'));
const safeWipe = require('safe-wipe');
const vfs = require('vinyl-fs');
const converter = require('sass-convert');
const pipe = require('multipipe'); // jshint ignore:line
const through = require('through2');

/**
 * Expose lower API blocks.
 */
export { Environment, Logger, Parser, sorter, errors };

/**
 * Boostrap Parser and AnnotationsApi, execute parsing phase.
 * @return {Stream}
 * @return {Promise} - as a property of Stream.
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
 * Ensure a proper Environment Object and events.
 * @return {Object}
 */
export function ensureEnvironment(config, onError = e => { throw e; }) {
  if (config instanceof Environment) {
    config.on('error', onError);
    return config;
  }

  let logger = ensureLogger(config);
  let env = new Environment(logger, config.strict);

  env.on('error', onError);
  env.load(config);
  env.postProcess();

  return env;
}

/**
 * Default public API method.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
export default function sassdoc(...args) {
  return srcEnv(documentize, stream)(...args); // jshint ignore:line

  /**
   * Safely wipe and re-create the destination directory.
   * @return {Promise}
   */
  function refresh(env) { // jshint ignore:line
    return safeWipe(env.dest, {
      force: true,
      parent: is.string(env.src) || is.array(env.src) ? g2b(env.src) : null,
      silent: true,
    })
      .then(() => mkdir(env.dest))
      .then(() => {
        env.logger.log(`Folder "${env.dest}" successfully refreshed.`);
      })
      .catch(err => {
        // Friendly error for already existing directory.
        throw new errors.SassDocError(err.message);
      });
  }

  /**
   * Render theme with parsed data context.
   * @return {Promise}
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
   * Execute full SassDoc sequence from a source directory.
   * @return {Promise}
   */
  async function documentize(env) { // jshint ignore:line
    /* jshint ignore:start */

    init(env);

    let data = await baseDocumentize(env);

    if (!data.length) {
      env.emit('warning', new errors.Warning(`SassDoc could not find anything to document.

  * Are you still using \`/**\` comments? They're no more supported since 2.0.
    See <http://sassdoc.com/upgrading/#c-style-comments>.
  * Are you documenting actual Sass items (variables, functions, mixins, placeholders)?
    SassDoc doesn't support documenting CSS selectors.
    See <http://sassdoc.com/frequently-asked-questions/#does-sassdoc-support-css-classes-and-ids->.
`));
    }

    try {
      await refresh(env);
      await theme(env);
      okay(env);
    } catch (err) {
      env.emit('error', err);
      throw err;
    }

    return data;

    /* jshint ignore:end */
  }

  /**
   * Execute full SassDoc sequence from a Vinyl files stream.
   * @return {Stream}
   * @return {Promise} - as a property of Stream.
   */
  function stream(env) {
    let filter = parseFilter(env);

    filter.promise
      .then(data => {
        env.logger.log('SCSS files successfully parsed.');
        env.data = data;
      });

    /* jshint ignore:start */

    /**
     * Returned Promise await the full sequence,
     * instead of just the parsing step.
     */
    filter.promise = new Promise((resolve, reject) => {

      async function documentize() {
        try {
          init(env);
          await refresh(env);
          await theme(env);
          okay(env);
          resolve();
        } catch (err) {
          reject(err);
          env.emit('error', err);
          throw err;
        }
      }

      filter
        .on('end', documentize)
        .on('error', err => env.emit('error', err))
        .resume(); // Drain.

    });

    /* jshint ignore:end */

    return filter;
  }
}

/**
 * Parse and return data object.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
export function parse(...args) { // jshint ignore:line
  /* jshint ignore:start */

  return srcEnv(documentize, stream)(...args);

  /**
   * @return {Promise}
   */
  async function documentize(env) {
    let data = await baseDocumentize(env);

    return data;
  }

  /* jshint ignore:end */

  /**
   * Don't pass files through, but pass final data at the end.
   * @return {Stream}
   */
  function stream(env) { // jshint ignore:line
    let parse = parseFilter(env);

    let filter = through.obj((file, enc, cb) => cb(), function (cb) {
      parse.promise.then(data => {
        this.push(data);
        cb();
      }, cb);
    });

    return pipe(parse, filter);
  }
}

/**
 * @param {Object} config
 * @return {Logger}
 */
function ensureLogger(config) {
  if (!is.object(config) || !('logger' in config)) {
    // Get default logger.
    return new Logger(config.verbose, process.env.SASSDOC_DEBUG);
  }

  let logger = Logger.checkLogger(config.logger);
  delete config.logger;

  return logger;
}

/**
 * Source directory fetching and parsing.
 */
async function baseDocumentize(env) { // jshint ignore:line
  let filter = parseFilter(env);

  filter.promise
    .then(data => {
      env.logger.log(`Folder "${env.src}" successfully parsed.`);
      env.data = data;

      env.logger.debug(() => {
        fs.writeFile(
          'sassdoc-data.json',
          JSON.stringify(data, null, 2) + '\n'
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

  /* jshint ignore:end */
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
    let env = args.find(is.plainObject);

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
 * Init timer.
 */
function init(env) { // jshint ignore:line
  env.logger.time('SassDoc');
}

/**
 * Log final success message.
 */
function okay(env) { // jshint ignore:line
  env.logger.log('Process over. Everything okay!');
  env.logger.timeEnd('SassDoc', '%s completed after %dms');
}
