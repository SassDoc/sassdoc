let seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

export default function see(config) {
  return {
    name: 'see',

    parse(text) {
      let match = seeRegEx.exec(text);

      return {
        type: match[1] || 'function',
        name: match[2]
      };
    },

    resolve(data) {
      data.forEach(item => {
        if (item.see === undefined) {
          return;
        }

        item.see = item.see.map(see => {
          let seeItem = data.find(x => x.context.name === see.name);

          if (seeItem !== undefined) {
            return seeItem;
          }

          config.logger.log(`Item "${item.context.name}" refers to "${see.name}" from type "${see.type}" but this item doesn't exist.`);
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
      });
    },
  };
}
