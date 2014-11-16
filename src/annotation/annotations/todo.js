
export default function (config) {

  return {
    parse(text) {
      return text.trim();
    },

    alias: ['todos']
  }

};
