'use strict';

var logger = require('./log');
var path = require('path');
var chalk = require('chalk');
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
    // Require default config file at SassDoc's level
    return require('../view.json');
  }
}

/**
 * Resolve and require package value.
 *
 * @param {string|object} package
 * @return {object}
 */
function requirePackage(dir, pkg) {
  if (!pkg) {
    logger.log(chalk.yellow('No package information.'));
    return;
  }

  var path = dir + '/' + pkg;

  try {
    return require(path);
  } catch (e) {
    var message = 'Can\'t find a package file at `' + path + '`.';
    logger.log(chalk.yellow(message));
  }
}

/**
 * Resolve and require theme value.
 *
 * @param {string} theme
 * @return {function}
 */
function requireTheme(theme) {
  if (!theme) {
    theme = 'default';
  }

  return require('sassdoc-theme-' + theme);
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
    dir = path.dirname(config);
    config = requireConfig(config);
  } else {
    // `package` is relative to CWD
    dir = process.cwd();
  }

  // Resolve package
  if (typeof config.package !== 'object') {
    config.package = requirePackage(dir, config.package);

    // Parse as markdown (as per #115)
    if (config.package.description) {
      config.package.description = marked(config.package.description);
    }
  }

  // Resolve theme
  if (typeof config.theme !== 'function') {
    config.theme = requireTheme(config.theme);
  }

  return config;
};
