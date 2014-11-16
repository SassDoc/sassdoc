
export default function (config) {

  return {
    parse(text) {
      return text.trim();
    },

    alias: ['outputs'],

    allowedOn: ['mixin'],

    multiple: false
  }
  
};
