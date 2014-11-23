let typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:\$?([^\s]+))?\s*(?:\((.*)\))?\s*(?:-?\s*([\s\S]*))?/;

export default function parameter() {
  return {
    name: 'parameter',

    parse(text) {
      let parsed = typeRegEx.exec(text);
      let obj = {};

      if (parsed[1]) {
        obj.type = parsed[1];
      }

      if (parsed[2]) {
        obj.name = parsed[2];
      }

      if (parsed[3]) {
        obj.default = parsed[3];
      }

      if (parsed[4]) {
        obj.description = parsed[4];
      }

      return obj;
    },

    alias: ['arg', 'arguments', 'param', 'parameters'],

    allowedOn: ['function', 'mixin'],
  };
}
