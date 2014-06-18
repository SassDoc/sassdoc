// Get filename without extension
module.exports.removeExtension = function (filename) {
  return filename.replace(/(.*)\.(.*?)$/, '$1');
};

// Get file extension
module.exports.getExtension = function (filename) {
  return filename.split('.').pop();
};

// Get current date/time
module.exports.getDateTime = function () {
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

module.exports.pad = function (value) {
  return (value < 10 ? '0' : '') + value;
};

module.exports.computeAssetPath = function (destination) {
  var path = '';

  for (var i = 0; i < destination.split('/').length; i++) {
    path = '../' + path;
  }

  path += 'assets/css/styles.css';

  return path;
};