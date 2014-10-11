'use strict';

var fs = require('./file');
var logger = require('./log');
var cgf = require('./cfg');
var safeWipe = require('safe-wipe');

exports = module.exports = {

  /**
   * Expose the version.
   * @return {String} Version number
   */
  version: require('../package.json').version,

  /**
   * Main API function, running the whole thing.
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @param {Object} config - `.sassdocrc` path (or parsed content) or `cfg` output
   * @example
   * documentize('examples/sass', 'examples/dist', config)
   * @return {Q.Promise}
   */
  documentize: function (source, destination, config) {
    if (!config || !('__sassdoc__' in config)) {
      config = cgf(config);
    }

    return safeWipe(destination, {
      interactive: config.view.interactive || false,
      parent: source,
      silent: true,
      force: config.view.force
    })
      .then(function () {
        return fs.folder.create(destination);
      }, function (err) {
        logger.error(err.message);
        err.silent = true;
        throw err;
      })
      .then(function () {
        logger.log('Folder `' + destination + '` successfully generated.');
        return fs.getData(source, config.theme.annotations, config.view);
      })
      .then(function (data) {
        logger.log('Folder `' + source + '` successfully parsed.');
        config.data = data;

        var promise = config.theme(destination, config);

        if (promise && typeof promise.then === 'function') {
          return promise;
        }

        throw new Error('Theme didn\'t return a promise, got ' +
                        Object.prototype.toString.call(promise) + '.');
      })
      .then(function () {
        var themeLog = config.themeName ?
          'Theme `' + config.themeName + '` successfully rendered.' :
          'Anonymous theme successfully rendered.';

        logger.log(themeLog);
        logger.log('Process over. Everything okay!');
      }, function (err) {
        if (!err.silent) {
          logger.error('stack' in err ? err.stack : err);
        }
        throw err;
      });
  },

  /**
   * Parse a folder and returns a promise yielding an array of documented items.
   * @param {String} source - Source folder
   * @example
   * sassdoc.parse('examples/sass')
   * @return {Q.Promise}
   */
  parse: function (source, annotations, view) {
    return fs.getData(source, annotations, view);
  },

  /**
   * Expose the logger used by sassdoc.
   * @return {logger}
   */
  logger: logger
};
