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
  month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
  day   = (date.getDate()      < 10 ? '0' : '') + date.getDate();
  hour  = (date.getHours()     < 10 ? '0' : '') + date.getHours();
  min   = (date.getMinutes()   < 10 ? '0' : '') + date.getMinutes();
  sec   = (date.getSeconds()   < 10 ? '0' : '') + date.getSeconds();

  return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
};