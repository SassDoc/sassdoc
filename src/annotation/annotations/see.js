let utils = require('../../utils');

let seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

export default function (config) {

  return {
    name: 'see',

    parse(text) {
      let match = seeRegEx.exec(text);

      return {
        type: match[1] || 'function',
        name: match[2]
      };
    },

    resolve(byTypeAndName) {
      utils.eachItem(byTypeAndName, item => {
        if (item.see !== undefined) {
          item.see = item.see.map(see => {
            if (
              byTypeAndName[see.type] !== undefined &&
              byTypeAndName[see.type][see.name] !== undefined
            ) {
              return byTypeAndName[see.type][see.name];
            } else {
              config.logger.log(
                `Item "${item.context.name}" refers to "${see.name}" from type "${see.type}" but this item doesn't exist.`
              );
            }
          })
          .filter(x => x !== undefined);

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
  };

}
