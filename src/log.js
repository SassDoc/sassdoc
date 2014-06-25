'use strict';

var utils = require('./utils');

exports = module.exports = {
  enabled: false,

  /**
   * Log arguments into the console
   */
  log: function () {
    if (exports.enabled === true) {
      console.log.apply(console, [utils.getDateTime()].concat(Array.prototype.slice.call(arguments)));
    }
  }
};
