'use strict';

var logger = require('./log');
var path = require('path');

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
      if (e.code !== 'MODULE_NOT_FOUND') throw e;

      logger.warn('No package information.');
      return;
    }
  }

  var path = dir + '/' + pkg;

  try {
    return require(path);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;

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
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
  }

  try {
    return require(dir + '/' + theme);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
  }

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
    if (e.code !== 'MODULE_NOT_FOUND') throw e;

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
 * @param {string|object} view
 * @return {object}
 */
module.exports = function (view) {
  // Relative directory for `package` file
  var dir;
  var config = {};

  if (typeof view !== 'object') {
    dir = path.resolve(path.dirname(config));
    view = requireConfig(view);
  } else {
    // `package` is relative to CWD
    dir = process.cwd();
  }

  config.view = view;

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
  }

  return config;
};
