
export default function () {

  return {
    name: 'todo',

    parse(text) {
      return text.trim();
    },

    alias: ['todos']
  };

}
