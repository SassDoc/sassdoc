'use strict';

var path = require('path');

var namespaceDelimiters = ['::', ':', '\\.', '/'];
var namespaceDelimitersRegExp = new RegExp(namespaceDelimiters.join('|'), 'g');

exports = module.exports = {

  /**
   * Get file extension
   * @param  {string} filename - filename to retrieve extension from
   * @return {string}            extension
   */
  getExtension: function (filename) {
    return path.extname(filename).substr(1);
  },

  /**
   * Get file display path, relative to the project directory
   * @param  {string} filePath - file path
   * @param  {string} baseDir  - project base directory
   * @return {string}            display path
   */
  getDisplayPath: function (filePath, baseDir) {
    return path.join(baseDir, filePath);
  },

  /**
   * Get current date/time
   * @return {string} Stringified date time
   */
  getDateTime: function () {
    var date = new Date(),
        year, month, day, hour, min, sec;

    year  = date.getFullYear();
    month = exports.pad(date.getMonth() + 1);
    day   = exports.pad(date.getDate());
    hour  = exports.pad(date.getHours());
    min   = exports.pad(date.getMinutes());
    sec   = exports.pad(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  },

  /**
   * Pad a number with a leading 0 if inferior to 10
   * @param  {number} value - number to pad
   * @return {string|number}  padded number or initial number
   */
  pad: function (value) {
    return (value < 10 ? '0' : '') + value;
  },

  /**
   * Returns whether a value is set or not
   * @param {*} value - value to check
   * @return {Bool}
   */
  isset: function (value) {
    return typeof value !== 'undefined';
  },

  /**
   * Split a string on possible namespace delimiters
   * @param {String} value - value to split
   * @return {Array}
   */
  splitNamespace: function (value) {
    return value.split(namespaceDelimitersRegExp);
  }
};
