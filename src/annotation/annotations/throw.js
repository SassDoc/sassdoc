let autoParserError = /@error\s+(?:'|")([^'"]+)/g;

export default {

  parse(text) {
    return text.trim();
  },

  autofill(item) {
    let match;
    let throwing = item.throws || [];

    while ((match = autoParserError.exec(item.context.code))) {
      throwing.push(match[1]);
    }
    if (throwing.length > 0) {
      return throwing;
    }
  },

  alias: ['throws', 'exception'],

  allowedOn: ['function', 'mixin', 'placeholder']

};
