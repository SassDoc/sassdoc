'use strict';

var utils = require('../../utils');
var logger = require('../../log');

module.exports = {

  parse: function (text) {
    return text.trim();
  },

  resolve: function (byTypeAndName) {
    utils.eachItem(byTypeAndName, function (item) {
      if (utils.isset(item.alias)) {
        item.alias.forEach(function (alias) {

          var type = item.context.type;
          var name = item.context.name;

          if (utils.isset(byTypeAndName[type]) &&
              utils.isset(byTypeAndName[type][alias])) {

            if (!Array.isArray(byTypeAndName[type][alias].aliased)) {
              byTypeAndName[type][alias].aliased = [];
            }

            byTypeAndName[type][alias].aliased.push(name);

          }
          else {
            logger.log('Item `' + name + '` is an alias of `' + alias + '` but this item doesn\'t exist.');
          }
        });
      }
    });
  }
};
