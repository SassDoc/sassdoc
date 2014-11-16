
export default function (config) {

  return {
    parse(text) {
      return text.trim();
    },

    default() {
      return 'public';
    },

    multiple: false
  }

};
