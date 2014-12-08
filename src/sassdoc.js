let utils = require('./utils');
let errors = require('./errors');

let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let vfs = require('vinyl-fs');

let Environment = require('./environment').default;
let Logger = require('./logger').default;
let Parser = require('./parser').default;
let exclude = require('./exclude').default;
let recurse = require('./recurse').default;
let sort = require('./sorter').default;

let converter = require('sass-convert');
let pipe = require('multipipe');

export default function sassdoc(src, dest, env = {}) {
  let logger, deferred = utils.defer();
  env = ensureEnvironment(env, deferred.reject);

  refresh(dest, {
    interactive: env.interactive || false,
    force: env.force || false,
    parent: utils.g2b(src),
    silent: true,
  })

    .then(() => {
      logger.log(`Folder "${dest}" successfully refreshed.`);
      return parse(src, env);
    }, error => {
      // Friendly error for already existing directory
      throw new errors.Error(error.message);
    })

    .then(data => {
      logger.log(`Folder "${src}" successfully parsed.`);
      env.data = data;

      let promise = env.theme(dest, env);

      if (promise && typeof promise.then === 'function') {
        return promise;
      }

      let type = Object.prototype.toString.call(promise);
      throw new errors.Error(`Theme didn't return a promise, got ${type}.`);
    })

    .then(() => {
      if (env.themeName) {
        logger.log(`Theme "${env.themeName}" successfully rendered.`);
      } else {
        logger.log('Anonymous theme successfully rendered.');
      }

      logger.log('Process over. Everything okay!');
    })

    .then(deferred.resolve, error => env.emit('error', error));

  return deferred.promise;
}

export function parse(src, env = {}) {
  let deferred = utils.defer();
  env = ensureEnvironment(env, deferred.reject);

  let parser = new Parser(env, env.theme && env.theme.annotations);
  let parseFilter = parser.stream();

  let stream = pipe(
    recurse(),
    exclude(env.exclude || []),
    converter({ from: 'sass', to: 'scss' }),
    parseFilter
  );

  vfs.src(src)
    .pipe(stream)
    .on('error', deferred.reject);

  parseFilter.promise
    .then(data => sort(data))
    .then(deferred.resolve, deferred.reject);

  return deferred.promise;
}

export function refresh(dest, env) {
  return safeWipe(dest, env)
    .then(() => mkdir(dest));
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

// Backward compability with v1.0 API.
/*global sassdoc: true */
export var documentize = sassdoc;

// Re-export, expose API.
export { Environment, Logger, Parser, sort , recurse, exclude, errors };
