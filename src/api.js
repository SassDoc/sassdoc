'use strict';

var fs     = require('./file');
var logger = require('./log');
var cgf    = require('./cfg');

exports = module.exports = {

  /**
   * Expose the version.
   * @return {String} Version number
   */
  version: require('../package.json').version,

  /**
   * Main API function, running the whole thing
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @param {Object} config - Configuration from `view.json`
   * @example
   * documentize('examples/sass', 'examples/dist', config)
   * @return {Q.promise}
   */
  documentize: function (source, destination, config) {
    config = cgf(config);

    return fs.folder.refresh(destination)
      .then(function () {
        logger.log('Folder `' + destination + '` successfully generated.');
        return fs.getData(source);
      })
      .then(function (data) {
        console.log(data);
        logger.log('Folder `' + source + '` successfully parsed.');
        config.data = data;
        return config.theme(destination, config);
      })
      .then(function () {
        logger.log('Theme successfully rendered.');
        logger.log('Process over. Everything okay!');
      })
      .fail(function (err) {
        console.log(err.stack);
        throw new Error(err);
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
  },

  /**
   * Expose the logger used by sassdoc
   * @return {Logger}
   */
  logger: logger
};
