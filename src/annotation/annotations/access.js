
export default function (config) {

  return {
    name: 'access',

    parse(text) {
      return text.trim();
    },

    default() {
      return 'public';
    },

    multiple: false
  }

};
