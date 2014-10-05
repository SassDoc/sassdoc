'use strict';

var autoParserError = /@error\s+(?:'|")([^'"]+)/g;

module.exports = {
  parse: function (text) {
    return text.trim();
  },
  default : function(item){
    var match;
    var throwing = [];
    while ( (match = autoParserError.exec(item.context.code)) ) {
      throwing.push(match[1]);
    }
    // Workaround till `default` API is updated!
    item['throws'] = throwing;
  },
  alias: ['throw', 'exception'],
  allowedOn: ['function', 'mixin', 'placeholder']
};
