
export default function () {

  return {
    name: 'access',

    parse(text) {
      return text.trim();
    },

    default() {
      return 'public';
    },

    multiple: false
  };

}
