
export default {

  parse(text) {
    return [text.trim().toLowerCase()];
  },

  default() {
    return ['undefined'];
  },

  multiple: false

};
