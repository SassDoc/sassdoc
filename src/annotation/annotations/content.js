'use strict';

module.exports = {

  parse: function (text) {
    return text.trim();
  },

  autofill: function(item){
    if (item.context.code.indexOf('@content') > -1){
     return '';
    }
  },

  allowedOn : ['mixin'],

  multiple : false
};
