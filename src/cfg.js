'use strict';

var logger = require('./log');
var path = require('path');
var chalk = require('chalk');

function requireConfig(config) {
  // Find configuration file
  if (config) {
    // Require given config file

    if (config[0] === '/') {
      // Absolute
      return require(config);
    }

    // Relative
    return require(process.cwd() + '/' + config);
  }

  try {
    // Require default config file at project level
    return require(process.cwd() + '/' + './view.json');
  } catch (e) {
    // Require default config file at SassDoc's level
    return require('../view/view.json');
  }
}

module.exports = function (config) {
  // Relative directory for `package` file
  var dir;

  if (typeof config !== 'object') {
    // `package` is relative to config file
    dir = path.resolve(path.dirname(config));
    config = requireConfig(config);
  } else {
    // `package` is relative to CWD
    dir = process.cwd();
  }

  if (typeof config.package !== 'string') {
    // Assume already an object
    return config;
  }

  // Find package file
  var packagePath = dir + '/' + config.package;

  try {
    config.package = require(packagePath);
  } catch (e) {
    var message = 'Can\'t find a package file at `' + packagePath+ '`.';
    logger.log(chalk.yellow(message));
  }

  return config;
};
