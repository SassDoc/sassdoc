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
        var group, i;
        var count = 0;
        var shouldBeDisplayed = function (item) {
          return (config.display.access.indexOf(item.access[0]) !== -1) && !(!config.display.alias && item.alias);
        };

        // Adding a `display` key to each item
        for (group in data) {
          for (i = 0; i < data[group].length; i++) {
            data[group][i].display = shouldBeDisplayed(data[group][i]);

            if (data[group][i].display === true) {
              count++;
            }
          }
        }

        config.dataCount = count;

        return data;
      })
      .then(function (data) {
        logger.log('Folder `' + source + '` successfully parsed.');
        config.data = data;

        var promise = config.theme(destination, config);

        if (promise && typeof promise.then === 'function') {
          return promise;
        }

        throw 'Theme didn\'t return a promise, got ' +
              Object.prototype.toString.call(promise) + '.';
      })
      .then(function () {
        logger.log('Theme successfully rendered.');
        logger.log('Process over. Everything okay!');
      })
      .fail(function (err) {
        logger.error(err);
        throw err;
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
