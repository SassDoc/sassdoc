
export default function (config) {

  return {
    name: 'todo',

    parse(text) {
      return text.trim();
    },

    alias: ['todos']
  }

};
