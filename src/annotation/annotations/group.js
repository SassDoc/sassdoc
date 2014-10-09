'use strict';

module.exports = {
  parse: function (text) {
    return [text.trim().toLowerCase()];
  },
  default: function () {
    return [['undefined']];
  }
};
