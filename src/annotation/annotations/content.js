
export default {

  parse(text) {
    return text.trim();
  },

  autofill(item) {
    if (item.context.code.indexOf('@content') > -1) {
      return '';
    }
  },

  allowedOn: ['mixin'],

  multiple: false

};
