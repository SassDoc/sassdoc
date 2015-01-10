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
 */
export default function sassdoc(...args) {
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

  return task();

  /**
   * Safely wipe and re-create the destination dir.
   */
  function refresh() { // jshint ignore:line
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
    let filter = parseFilter(env);

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
