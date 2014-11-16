
export default function (config) {

  return {
    parse(text) {
      return [text.trim().toLowerCase()];
    },

    default() {
      return ['undefined'];
    },

    multiple: false
  }

};
