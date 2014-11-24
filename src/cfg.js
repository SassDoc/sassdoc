let fs = require('fs');
let path = require('path');
let yaml = require('js-yaml');
let log = require('./logger');
let theme = require('./theme').default;

/**
 * See both `pre` and `post`.
 *
 * @param {Object|String} config
 * @param {Logger} logger
 * @return {Object}
 */
export default function cfg(config, logger = log.empty) {
  if (typeof config !== 'object') {
    config = pre(config, logger);
  }

  return post(config);
}

/**
 * Get the configuration object from given file of `.sassdocrc` if not
 * found.
 *
 * The `dir` property will be the directory of the given file or the CWD
 * if no file is given. The configuration paths should be relative to
 * it.
 *
 * The given logger will be injected in the configuration object for
 * further usage.
 *
 * @param {String} file
 * @param {Logger} logger
 * @return {Object}
 */
export function pre(file, logger = log.empty) {
  file = resolve(process.cwd(), file);

  let config = maybe(file, () => {
    if (file !== undefined) {
      logger.error(`Config file "${file}" not found.`);
      logger.warn('Falling back to ".sassdocrc".');
    }

    return maybe('.sassdocrc', () => {
      return {logger};
    });
  });

  config.logger = logger;

  if (file !== undefined) {
    config.dir = path.resolve(path.dirname(file));
  }

  return config;
}

/**
 * Post process given configuration object to ensure `package` and
 * `theme` are uniform values.
 *
 * The `package` key is ensured to be an object. If it's a string, it's
 * required as JSON, relative to the configuration file directory.
 *
 * The `theme` key, if present and not already a function, will be resolved to
 * the actual theme function.
 *
 * @param {Object} config
 * @return {Object}
 */
export function post(config) {
  if (config.dir === undefined) {
    config.dir = process.cwd();
  }

  if (typeof config.package !== 'object') {
    let file = resolve(config.dir, config.package);

    config.package = maybe(file, () => {
      if (config.package !== undefined) {
        config.logger.error(`Package file "${file}" not found.`);
        config.logger.warn('Falling back to "package.json".');
      }

      let file = path.resolve(config.dir, 'package.json');

      return maybe(file, () => {
        config.logger.warn('No package information.');
      });
    });
  }

  if (typeof config.theme !== 'function') {
    config.themeName = config.theme || 'default';
    config.theme = theme(config.theme, config.dir, config.logger);
  }

  return config;
}

/**
 * If given file is not undefined, resolve it to given directory.
 *
 * @param {String} dir
 * @param {String} file
 * @return {String}
 */
function resolve(dir, file) {
  if (file !== undefined) {
    return path.resolve(dir, file);
  }
}

/**
 * Try `load` for given file but call given fallback if an exception
 * with `ENOENT` code is thrown, or if the file is undefined.
 *
 * Other exceptions are not muted.
 *
 * @param {Function} loader
 * @param {String} file
 * @param {Function} fallback
 * @return {Object}
 */
function maybe(file, fallback = () => {}) {
  if (file === undefined) {
    return fallback();
  }

  try {
    return load(file);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  return fallback();
}

/**
 * Load YAML or JSON from given file path.
 *
 * @param {String} path
 * @return {Object}
 */
function load(path) {
  return yaml.safeLoad(fs.readFileSync(path, 'utf-8'));
}
