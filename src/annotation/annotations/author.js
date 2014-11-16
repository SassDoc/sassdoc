
export default function (config) {

  return {
    name: 'author',

    parse(text) {
      return text.trim();
    }
  }

};
