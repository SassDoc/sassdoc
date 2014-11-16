
export default function () {

  return {
    name: 'output',

    parse(text) {
      return text.trim();
    },

    alias: ['outputs'],

    allowedOn: ['mixin'],

    multiple: false
  };

}
