import * as utils from '../../utils';

let seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

export default function (config) {

  return {
    parse(text) {
      let match = seeRegEx.exec(text);

      return {
        type: match[1] || 'function',
        name: match[2]
      };
    },

    resolve(byTypeAndName) {
      utils.eachItem(byTypeAndName, item => {
        if (utils.isset(item.see)) {
          item.see = item.see.map(see => {
            if (utils.isset(byTypeAndName[see.type]) &&
                utils.isset(byTypeAndName[see.type][see.name])) {
              return byTypeAndName[see.type][see.name];
            }
            else {
              config.logger.log(
                `Item "${item.context.name}" refers to "${see.name}" from type "${see.type}" but this item doesn't exist.`
              );
            }
          })
          .filter(utils.isset);

          item.see.toJSON = function () {
            return item.see.map(item => {
              return {
                description: item.description,
                context: item.context
              };
            });
          };
        }
      });
    }
  }

};
