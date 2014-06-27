'use strict';

exports = module.exports = {

  /**
   * Get file extension
   * @param  {string} filename - filename to retrieve extension from
   * @return {string}            extension
   */
  getExtension: function (filename) {
    return filename.split('.').pop().toLowerCase();
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
   * Remove leading comment symbols from a line
   * @param  {string} line - line to be purged
   * @return {string}        new line
   */
  uncomment: function (line) {
    return line.trim().replace(/^\/{2,}/i, '').replace(/^\/?\*+\/?/i, '').trim();
  },

  /**
   * Returns whether a value is set or not
   * @param {*} value - value to check
   * @return {Bool}
   */
  isset: function (value) {
    return typeof value !== "undefined";
  }

};

/**
 * Extend String primitive to add a repeat function
 * @param  {integer} times - number of times to repeat string
 * @return {string}          final string
 */
String.prototype.repeat = function (times) {
   return (new Array(times + 1)).join(this);
};

/**
 * Extend String primitive to add a trim function
 * @return {string} trimed string
 */
String.prototype.trim = function () {
  return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};

/**
 * Extend String primitive to add a capitalize function
 */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}