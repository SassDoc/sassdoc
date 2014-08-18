'use strict';

var reqRegEx = /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\((.*)\))?\s*(?:-?\s*([^<$]*))?\s*(?:<?\s*(.*)\s*>)?$/;

var utils = require('../../utils');
var logger = require('../../log');

module.exports = {

  parse: function (text) {
    var match = reqRegEx.exec(text.trim());

    var obj = {
      type: match[1] || 'function',
      name: match[2]
    };

    obj.external = utils.splitNamespace(obj.name).length > 1;

    if (obj.name.indexOf('$') === 0) {
      obj.type = 'variable';
      obj.name = obj.name.slice(1);
    }

    if (match[4]) {
      obj.description = match[4].trim();
    }

    if (match[5]) {
      obj.url = match[5];
    }

    return obj;
  },

  resolve: function (byTypeAndName) {

    utils.eachItem(byTypeAndName, function (item) {
      if (utils.isset(item.requires)) {
        item.requires = item.requires.map(function (req) {
          if (req.external === true) {
            return req;
          }

          if (utils.isset(byTypeAndName[req.type]) &&
              utils.isset(byTypeAndName[req.type][req.name])) {

            var reqItem = byTypeAndName[req.type][req.name];

            if (!Array.isArray(reqItem.usedBy)) {
              reqItem.usedBy = [];
            }
            reqItem.usedBy.push(item);
            req.item = reqItem;

            return reqItem;
          } else {
            logger.log('Item `' + item.context.name +
              '` requires `' + req.name + '` from type `' + req.type +
              '` but this item doesn\'t exist.');
          }

          return req;
        });
      }
    });

  }
};
