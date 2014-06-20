/**
 * Utils object
 *
 * @constructs
 */
var Utils = function () {};

/**
 * Get filename without extension
 * @param  {string} filename - filename to remove extension from
 * @return {string}            filename without extension
 */
Utils.prototype.removeExtension = function (filename) {
  return filename.replace(/(.*)\.(.*?)$/, '$1');
};

/**
 * Get file extension
 * @param  {string} filename - filename to retrieve extension from
 * @return {string}            extension
 */
Utils.prototype.getExtension = function (filename) {
  return filename.split('.').pop();
};

/**
 * Get current date/time
 * @return {string} Stringified date time
 */
Utils.prototype.getDateTime = function () {
  var date = new Date(),
      year, month, day, hour, min, sec;

  year  = date.getFullYear();
  month = this.pad(date.getMonth() + 1);
  day   = this.pad(date.getDate());
  hour  = this.pad(date.getHours());
  min   = this.pad(date.getMinutes());
  sec   = this.pad(date.getSeconds());

  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
};

/**
 * Pad a number with a leading 0 if inferior to 10
 * @param  {number} value - number to pad
 * @return {string|number}  padded number or initial number
 */
Utils.prototype.pad = function (value) {
  return (value < 10 ? '0' : '') + value;
};

/**
 * Remove leading comment symbols from a line
 * @param  {string} line - line to be purged
 * @return {string}        new line
 */
Utils.prototype.uncomment = function (line) {
  return line.trim().replace(/^\/{2,}/i, '').replace(/^\/?\*+\/?/i, '').trim();
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

module.exports.utils = Utils;