
export default function (config) {

  return {
    name: 'deprecated',

    parse(text) {
      return text.trim();
    },

    multiple: false
  }

};
