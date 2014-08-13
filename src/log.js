'use strict';

var chalk = require('chalk');
var utils = require('./utils');

var arr = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * Add brackets around given string.
 *
 * @param {String} str
 * @return {String}
 */
function br(str) {
  return '[' + str + ']';
}

/**
 * Prepends given argument to given array.
 *
 * @param {*} arg
 * @param {Array} arr
 * @return {Array}
 */
function prepend(arg, arr) {
  return [arg].concat(arr);
}

/**
 * @param {String} arg
 * @param {Array} arr
 * @return {Array}
 */
function prependBr(arg, arr) {
  return prepend(br(arg), arr);
}

/**
 * @param {Array} args
 * @return {Array}
 */
function date(args) {
  return prependBr(utils.getDateTime(), args);
}

/**
 * @param {String} name
 * @param {Array} args
 * @return {Array}
 */
function flag(name, args) {
  return prependBr(name, args);
}

/**
 * @param {arguments} args
 * @return {String}
 */
function log(args) {
  return date(arr(args)).join(' ');
}

/**
 * @param {String} name
 * @param {arguments} args
 * @return {String}
 */
function flog(name, args) {
  return log(flag(name, arr(args)));
}

exports = module.exports = {
  enabled: false,

  /**
   * Log arguments into the console if the logger is enabled.
   *
   * @param {...*}
   */
  log: function () {
    if (exports.enabled === true) {
      console.log(log(arguments));
    }
  },

  /**
   * Always log arguments as warning into the console.
   *
   * @param {...*}
   */
  warn: function () {
    console.warn(chalk.yellow(flog('WARNING', arguments)));
  },

  /**
   * Always log arguments as error into the error console.
   *
   * @param {...*}
   */
  error: function () {
    console.error(chalk.red(flog('ERROR', arguments)));
  }
};
