'use strict';

var fs     = require('./file');
var logger = require('./log');

exports = module.exports = {
  /**
   * Main API function, running the whole thing
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @example
   * documentize('examples/sass', 'examples/dist')
   */
  documentize: function (source, destination, config) {
    fs.folder.refresh(destination)
      .then(function () {
        logger.log('Folder `' + destination + '` successfully generated.');
        return fs.getData(source);
      })
      .then(function (data) {
        logger.log('Folder `' + source + '` successfully parsed.');
        return fs.generate(data, destination + '/index.html', config);
      })
      .then(function () {
        logger.log('Documentation for folder `' + source + '` successfully generated.');
        return fs.dumpAssets(destination);
      })
      .then(function () {
        logger.log('Process over. Everything okay!');
      })
      .fail(function (err) {
        console.error(err);
      });
  },

  /**
   * Parse a folder and returns a promise yielding an array of documented items
   * @param {String} source - Source folder
   * @example
   * sassdoc.parse('examples/sass')
   * @return {Q.promise}
   */
  parse: function (source) {
    return fs.getData(source);
  }

};
