'use strict';
var utils = require('../../utils');
var logger = require('../../log');

module.exports = {
  parse : function (text) {
    return text.trim();
  },

  resolve : function (byTypeAndName) {

    utils.eachItem(byTypeAndName, function (item){
      if (utils.isset(item.alias)) {
        item.alias.forEach(function (alias) {
          if (utils.isset(byTypeAndName[alias.type]) &&
              utils.isset(byTypeAndName[alias.type][alias.name])) {

            if (!Array.isArray(byTypeAndName[alias.type][alias.name].aliased)) {
             byTypeAndName[alias.type][alias.name].aliased = [];
            }

            byTypeAndName[alias.type][alias.name].aliased.push(item.context.name);

          } else {
            logger.log('Item `' + item.context.name + '` is an alias of `' + alias + '` but this item doesn\'t exist.');
          }
        });
      }
    });

  }
};
