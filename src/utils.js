'use strict';

var path = require('path');
var _ = require('lodash');

var namespaceDelimiters = ['::', ':', '\\.', '/'];
var namespaceDelimitersRegExp = new RegExp(namespaceDelimiters.join('|'), 'g');

exports = module.exports = {

  mapArray: function (array, callback) {
    var copy = array.slice();
    return copy.map(callback);
  },

  eachItem: function (byTypeAndName, callback) {
    _.each(byTypeAndName, function (typeObj) {
      _.each(typeObj, function (item) {
        callback(item);
      });
    });
  },

  /**
   * Get file extension
   * @param  {String} filename - filename to retrieve extension from
   * @return {String}            extension
   */
  getExtension: function (filename) {
    return path.extname(filename).substr(1);
  },

  /**
   * Get current date/time
   * @return {String} Stringified date time
   */
  getDateTime: function () {
    var date = new Date();
    var year, month, day, hour, min, sec;

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
   * @param  {Number} value - number to pad
   * @return {String|Number}  padded number or initial number
   */
  pad: function (value) {
    return (value < 10 ? '0' : '') + value;
  },

  /**
   * Returns whether a value is set or not
   * @param {*} value - value to check
   * @return {Boolean}
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
