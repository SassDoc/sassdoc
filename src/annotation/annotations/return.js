let typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:-?\s*([\s\S]*))?/;

export default function return_() {
  return {
    name: 'return',

    parse(text) {
      let parsed = typeRegEx.exec(text);
      let obj = {};

      if (parsed[1]) {
        obj.type = parsed[1];
      }

      if (parsed[2]) {
	obj.description = parsed[2];
      }

      return obj;
    },

    alias: ['returns'],

    allowedOn: ['function'],

    multiple: false,
  };
}
