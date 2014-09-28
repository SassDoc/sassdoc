'use strict';

module.exports = {
  parse: function (text) {
    return text.trim();
  },

  alias: ['outputs'],

  allowedOn : ['mixin']
};
