var Utils = function () {};

// Get filename without extension
Utils.prototype.removeExtension = function (filename) {
  return filename.replace(/(.*)\.(.*?)$/, '$1');
};

// Get file extension
Utils.prototype.getExtension = function (filename) {
  return filename.split('.').pop();
};

// Get current date/time
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

Utils.prototype.pad = function (value) {
  return (value < 10 ? '0' : '') + value;
};

Utils.prototype.assetPath = function (destination, asset) {
  return '../'.repeat(destination.split('/').length) + 'assets/' + asset;
};

String.prototype.repeat = function(times) {
   return (new Array(times + 1)).join(this);
};

module.exports.utils = Utils;