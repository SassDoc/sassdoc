'use strict';

var autoParserError = /@error\s+(?:'|")([^'"]+)/g;

module.exports = {
  parse: function (text) {
    return text.trim();
  },
  autofill: function(item){
    var match;
    var throwing = item['throws'] || [];
    while ( (match = autoParserError.exec(item.context.code)) ) {
      throwing.push(match[1]);
    }
    if (throwing.length > 0) {
      return throwing;
    }
  },
  alias: ['throw', 'exception'],
  allowedOn: ['function', 'mixin', 'placeholder']
};
