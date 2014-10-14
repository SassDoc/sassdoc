'use strict';

var logger = require('./log');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
var chalk = require('chalk');
var _ = require('lodash');

/**
 * Tests given exception to see if the code is `MODULE_NOT_FOUND` and
 * if the exception text matches the module name.
 *
 * @param {String} name Module name to check in exception.
 * @param {Object} e Exception.
 * @return {Boolean}
 */
function isModuleNotFound(name, e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    return false;
  }

  return e.message.split('\'')[1].split('\'')[0] === name;
}

// Object identifier for module not found exception.
var MODULE_NOT_FOUND = {};

// Illegal type exception
var ILLEGAL_TYPE = {};

/**
 * Wrapper for `require` that will throw above `MODULE_NOT_FOUND` object
 * reference if the very module `name` was not found. If `name` is found
 * but an inner `require` fails, the normal exception will be thrown.
 */
function requireNotFound(name) {
  try {
    return require(name);
  } catch (e) {
    if (isModuleNotFound(name, e)) {
      throw MODULE_NOT_FOUND;
    }

    throw e;
  }
}

/**
 * Resolve and configuration file path.
 *
 * @param {String} config
 * @return {String}
 */
function resolveConfig(config) {
  return path.resolve(process.cwd(), config);
}

/**
 * Read a config file according to its extension.
 *
 * @param {String} file
 */
function readConfig(file) {
  return yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
}

/**
 * Try an array of config files until one is actually found, or
 * return empty object.
 *
 * @param {Array} configs
 */
function tryConfigs(configs) {
  for (var i = 0, length = configs.length; i < length; i++) {
    try {
      return readConfig(resolveConfig(configs[i]));
    } catch (e) {
      if (e !== ILLEGAL_TYPE && e.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  // Empty view config, maybe the theme will set default values.
  return {};
}

/**
 * Resolve and require configuration value.
 *
 * @param {String|Object} config
 * @return {Object}
 */
function requireConfig(config) {
  if (config) {
    try {
      return readConfig(resolveConfig(config));
    } catch (e) {
      if (e === ILLEGAL_TYPE) {
        // Already logged
      } else if (e.code === 'ENOENT') {
        logger.error('Config file `' + config + '` not found.');
      } else {
        throw e;
      }

      logger.warn('Falling back to default config.');
    }
  }

  logger.warn(
    'Starting SassDoc ' + chalk.grey('v2.0') + ', the default ' +
    'configuration file will be named ' + chalk.grey('.sassdocrc') + ' ' +
    'rather than ' + chalk.grey('view.{json,yaml,yml}') +
    '. Please consider using the ' + chalk.grey('--config') +
    ' option right now to specify your own file.'
  );

  return tryConfigs(['view.json', 'view.yaml', 'view.yml']);
}

/**
 * Resolve and require package value.
 *
 * @param {String} dir
 * @param {String|Object} package
 * @return {Object}
 */
function requirePackage(dir, pkg) {
  if (!pkg) {
    try {
      // Try `package.json` in the same directory.
      return requireNotFound(dir + '/package.json');
    } catch (e) {
      if (e !== MODULE_NOT_FOUND) {
        throw e;
      }

      logger.warn('No package information.');
      return null;
    }
  }

  var pkgPath = dir + '/' + pkg;

  try {
    return requireNotFound(pkgPath);
  } catch (e) {
    if (e !== MODULE_NOT_FOUND) {
      throw e;
    }

    var message = 'Can\'t find a package file at `' + pkgPath + '`.';
    logger.warn(message);
  }
}

/**
 * @param {*} theme
 * @return {Function}
 * @throws If the theme is not a function.
 */
function inspectTheme(theme) {
  var opt = Object.prototype.toString;
  var message; // Error message helper variable

  if (typeof theme !== 'function') {
    message = 'Given theme is ' + opt.call(theme) + ', expected ' +
              opt.call(inspectTheme) + '.';

    logger.error(message);

    throw message;
  }

  if (theme.length !== 2) {
    message = 'Given theme takes ' + theme.length + ' arguments, ' +
              'expected 2.';

    logger.warn(message);
  }

  return theme;
}

/**
 * Resolve and require theme value.
 *
 * `MODULE_NOT_FOUND` reference is thrown if nothing at all is found.
 *
 * @param {String} dir
 * @param {String} theme
 * @return {*}
 */
function requireRawTheme(dir, theme) {
  if (!theme) {
    theme = 'default';
  }

  try {
    return requireNotFound('sassdoc-theme-' + theme);
  } catch (e) {
    if (e !== MODULE_NOT_FOUND) {
      throw e;
    }
  }

  try {
    return requireNotFound(dir + '/' + theme);
  } catch (e) {
    if (e !== MODULE_NOT_FOUND) {
      throw e;
    }
  }

  return requireNotFound(theme);
}

/*global requireTheme:true */

/**
 * Fallback to default theme, logging a message.
 *
 * @param {String} dir
 */
function defaultTheme(dir) {
  logger.warn('Falling back to default theme.');
  return requireTheme(dir);
}

/**
 * Resolve require and validate theme value.
 *
 * @param {String} dir
 * @param {String} theme
 * @return {Function}
 */
function requireTheme(dir, theme) {
  try {
    theme = requireRawTheme(dir, theme);
  } catch (e) {
    if (e !== MODULE_NOT_FOUND) {
      throw e;
    }

    if (!theme) {
      // Default theme was not found? WTF!
      throw new Error('Holy shit, the default theme was not found!');
    }

    logger.error('Theme `' + theme + '` not found.');
    return defaultTheme(dir);
  }

  try {
    // Already logs any error
    return inspectTheme(theme);
  } catch (e) {
    return defaultTheme(dir);
  }
}

/**
 * Parse configuration.
 *
 * @param {String|Object} view
 * @param {Object} override Object that will override view properties.
 * @return {Object}
 */
module.exports = function (view, override) {
  // Relative directory for `package` file
  var dir;
  var config = {__sassdoc__: true};

  if (typeof view !== 'object') {
    dir = path.resolve(path.dirname(config));
    view = requireConfig(view);
  } else {
    // `package` is relative to CWD
    dir = process.cwd();
  }

  config.view = view = _.merge({}, view, override);

  // Resolve package
  if (typeof view.package === 'object') {
    config.package = view.package;
  } else {
    config.package = requirePackage(dir, view.package);
  }

  // Resolve theme
  if (typeof view.theme === 'function') {
    config.theme = view.theme;
  } else {
    config.theme = requireTheme(dir, view.theme);
    config.themeName = view.theme || 'default';
  }

  // Expose the relative path base
  config.dir = dir;

  return config;
};
