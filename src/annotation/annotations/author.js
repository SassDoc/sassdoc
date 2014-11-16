
export default function () {

  return {
    name: 'author',

    parse(text) {
      return text.trim();
    }
  };

}
