const seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

export default function see(env) {
  return {
    name: 'see',

    parse(text) {
      let match = seeRegEx.exec(text);

      let obj = {
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

    resolve(data) {
      data.forEach(item => {
        if (item.see === undefined) {
          return;
        }

        item.see = item.see.map(see => {
          let seeItem = Array.find(data, x => x.context.name === see.name);

          if (seeItem !== undefined) {
            return seeItem;
          }

          env.logger.warn(`Item \`${item.context.name}\` refers to \`${see.name}\` from type \`${see.type}\` but this item doesn't exist.`);
        })
          .filter(x => x !== undefined);

        item.see.toJSON = function () {
          return item.see.map(item => {
            return {
              description: item.description,
              context: item.context,
              group: item.group,
            };
          });
        };
      });
    },
  };
}
