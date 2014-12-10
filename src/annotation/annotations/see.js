'use strict';

var utils = require('../../utils');
var logger = require('../../log');

var seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

module.exports = {
  parse: function (text) {
    var match = seeRegEx.exec(text);

    var obj = {
      type: match[1] || 'function',
      name: match[2]
    };

    if (obj.name.indexOf('$') === 0) {
      obj.type = 'variable';
      obj.name = obj.name.slice(1);
    }

    if (obj.name.indexOf('%') === 0) {
      obj.type = 'placeholder';
      obj.name = obj.name.slice(1);
    }

    return obj;
  },

  resolve: function (byTypeAndName) {
    utils.eachItem(byTypeAndName, function (item) {
      if (utils.isset(item.see)) {
        item.see = item.see.map(function (see) {
          if (utils.isset(byTypeAndName[see.type]) &&
              utils.isset(byTypeAndName[see.type][see.name])) {
            return byTypeAndName[see.type][see.name];
          }
          else {
            logger.log('Item `' + item.context.name +
              '` refers to `' + see.name + '` from type `' + see.type +
              '` but this item doesn\'t exist.');
          }
        }).filter(function (item) {
          return utils.isset(item);
        });

        item.see.toJSON = utils.mapArray.bind(null, item.see, function (item) {
          return {
            description: item.description,
            context: item.context
          };
        });
      }
    });
  }
};
