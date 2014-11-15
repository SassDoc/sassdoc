import * as utils from '../../utils';
import Logger from '../../logger';
let logger = new Logger();

export default {

  parse(text) {
    return text.trim();
  },

  resolve(byTypeAndName) {
    utils.eachItem(byTypeAndName, item => {
      if (utils.isset(item.alias)) {
        let alias = item.alias;
        let type = item.context.type;
        let name = item.context.name;

        if (utils.isset(byTypeAndName[type]) &&
            utils.isset(byTypeAndName[type][alias])) {

          if (!Array.isArray(byTypeAndName[type][alias].aliased)) {
            byTypeAndName[type][alias].aliased = [];
          }

          byTypeAndName[type][alias].aliased.push(name);

        }
        else {
          logger.log(`Item \`${name}\` is an alias of \`${alias}\` but this item doesn't exist.`);
        }
      }
    });
  },

  allowedOn: ['function', 'mixin', 'variable'],

  multiple: false

};
