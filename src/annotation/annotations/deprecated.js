
export default function () {

  return {
    name: 'deprecated',

    parse(text) {
      return text.trim();
    },

    multiple: false
  };

}
