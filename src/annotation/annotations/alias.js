export default function alias(env) {
  return {
    name: 'alias',

    parse(text) {
      return text.trim();
    },

    resolve(data) {
      data.forEach(item => {
        if (item.alias === undefined) {
          return;
        }

        let name = item.context.name;
        let aliasedItem = Array.find(data, i => i.context.name === item.alias);

        if (aliasedItem === undefined) {
          env.logger.warn(`Item \`${name}\` is an alias of \`${item.alias}\` but this item doesn't exist.`);
          delete item.alias;
          return;
        }

        if (!Array.isArray(aliasedItem.aliased)) {
          aliasedItem.aliased = [];
        }

        aliasedItem.aliased.push(name);
      });
    },

    allowedOn: ['function', 'mixin', 'variable'],

    multiple: false,
  };
}
