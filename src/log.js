'use strict';

var chalk = require('chalk');
var utils = require('./utils');

var arr = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * Add brackets around given string.
 *
 * @param {string} str
 * @return {string}
 */
function br(str) {
  return '[' + str + ']';
}

/**
 * Prepends given argument to given array.
 *
 * @param {*} arg
 * @param {array} arr
 * @return {array}
 */
function prepend(arg, arr) {
  return [arg].concat(arr);
}

/**
 * @param {string} arg
 * @param {array} arr
 * @return {array}
 */
function prependBr(arg, arr) {
  return prepend(br(arg), arr);
}

/**
 * @param {array} args
 * @return {array}
 */
function date(args) {
  return prependBr(utils.getDateTime(), args);
}

/**
 * @param {string} name
 * @param {array} args
 * @return {array}
 */
function flag(name, args) {
  return prependBr(name, args);
}

/**
 * @param {arguments} args
 * @return {string}
 */
function log(args) {
  return date(arr(args)).join(' ');
}

/**
 * @param {string} name
 * @param {arguments} args
 * @return {string}
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
  },
};
