
export default function () {

  return {
    name: 'type',

    parse(text) {
      return text.trim();
    },

    allowedOn: ['variable'],

    multiple: false
  };

}
