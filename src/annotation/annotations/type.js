
export default function (config) {

  return {
    parse(text) {
      return text.trim();
    },

    allowedOn: ['variable'],

    multiple: false
  }

};
