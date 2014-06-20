var fs  = require('./file');
var log = require('./log');
var utils = require('./utils');
var Q = require('q');

exports = module.exports = {
  /**
   * Main API function, running the whole thing
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @example
   * documentize('examples/sass', 'examples/dist')
   */
  documentize: function (source, destination) {
    fs.folder.refresh(destination)
      .then(function () { 
        log.log('Folder `' + destination + '` successfully generated.');
        return fs.folder.parse(source)
      })
      .then(function (data) {
        log.log('Folder `' + source + '` successfully parsed.');
        return fs.generateDocumentation(data, destination);
      })
      .then(function () {
        log.log('Documentation for folder `' + source + '` successfully generated.');
        return fs.dumpAssets(destination);
      })
      .fail(function (err) {
        console.log(err);
      });
  },

  parse: function (source) {
    return fs.folder.read(source).then(function () {
      return fs.folder.parse(source);
    });
  }

};
