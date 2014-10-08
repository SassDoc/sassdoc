'use strict';

module.exports = {
  parse: function (text) {
    return text.trim();
  },
  default: function () {
    return ['public'];
  }
};
