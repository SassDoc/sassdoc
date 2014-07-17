'use strict';

var sassdoc = require('./api');
var path = require('path');

function resolveConfigPath(config) {
  // Find configuration file
  if (config) {
    // Require given config file

    if (config[0] === '/') {
      // Absolute
      return config;
    }

    // Relative
    return process.cwd() + '/' + config;
  }

  try {
    // Require default config file at project level
    return process.cwd() + '/' + './view.json';
  } catch (e) {
    // Require default config file at SassDoc's level
    return '../view/view.json';
  }
}

module.exports = function (config) {
  // Relative directory for `package` file
  var dir;

  if (typeof config === 'string') {
    // `package` is relative to config file
    dir = path.dirname(config);
    config = require(resolveConfigPath(config);
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
    sassdoc.logger.log(chalk.yellow(message));
  }
};
