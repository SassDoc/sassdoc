'use strict';

var logger = require('./log');
var path = require('path');
var marked = require('marked');

/**
 * Resolve and configuration file path.
 *
 * @param {string} config
 * @return {string}
 */
function resolveConfig(config) {
  if (config[0] === '/') {
    // Absolute
    return config;
  }

  // Relative
  return process.cwd() + '/' + config;
}

/**
 * Resolve and require configuration value.
 *
 * @param {string|object} config
 * @return {object}
 */
function requireConfig(config) {
  if (!config) {
    // Default value
    config = 'view.json';
  }

  config = resolveConfig(config);

  try {
    return require(config);
  } catch (e) {
    // Empty view config, maybe the theme will set default values
    return {};
  }
}

/**
 * Resolve and require package value.
 *
 * @param {string} dir
 * @param {string|object} package
 * @return {object}
 */
function requirePackage(dir, pkg) {
  if (!pkg) {
    try {
      // Try `package.json` in the same directory
      return require(dir + '/package.json');
    } catch (e) {
      logger.warn('No package information.');
      return;
    }
  }

  var path = dir + '/' + pkg;

  try {
    return require(path);
  } catch (e) {
    var message = 'Can\'t find a package file at `' + path + '`.';
    logger.warn(message);
  }
}

/**
 * @param {*} theme
 * @return {function}
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
 * @param {string} dir
 * @param {string} theme
 * @return {*}
 */
function requireRawTheme(dir, theme) {
  if (!theme) {
    theme = 'default';
  }

  try {
    return require('sassdoc-theme-' + theme);
  } catch (e) {}

  try {
    return require(dir + '/' + theme);
  } catch (e) {}

  return require(theme);
}

// JSHint sometimes needs a little bit of shut the fuck up ;(
var requireTheme;

/**
 * Fallback to default theme, logging a message.
 *
 * @param {string} dir
 */
function defaultTheme(dir) {
  logger.warn('Falling back to default theme.');
  return requireTheme(dir);
}

/**
 * Resolve require and validate theme value.
 *
 * @param {string} dir
 * @param {string} theme
 * @return {function}
 */
function requireTheme(dir, theme) {
  try {
    theme = requireRawTheme(dir, theme);
  } catch (e) {
    logger.error('Theme `' + (theme || 'default') + '` not found.');
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
 * @param {string|object} config
 * @return {object}
 */
module.exports = function (config) {
  // Relative directory for `package` file
  var dir;

  if (typeof config !== 'object') {
    dir = path.resolve(path.dirname(config));
    config = requireConfig(config);
  } else {
    // `package` is relative to CWD
    dir = process.cwd();
  }

  // Resolve package
  if (typeof config.package !== 'object') {
    config.package = requirePackage(dir, config.package);

    // Parse as markdown (as per #115)
    if (config.package && config.package.description) {
      config.package.description = marked(config.package.description);
    }
  }

  // Resolve theme
  if (typeof config.theme !== 'function') {
    config.theme = requireTheme(dir, config.theme);
  }

  return config;
};
