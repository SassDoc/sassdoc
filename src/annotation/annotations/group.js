
export default function (config) {

  return {
    name: 'group',

    parse(text) {
      return [text.trim().toLowerCase()];
    },

    default() {
      return ['undefined'];
    },

    multiple: false
  }

};
