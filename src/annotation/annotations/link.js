let linkRegex = /\s*([^:]+\:\/\/[^\s]*)?\s*(.*?)$/;

export default {

  parse(text) {
    let parsed = linkRegex.exec(text.trim());

    return {
      url: parsed[1] || '',
      caption: parsed[2] || ''
    };
  },

  alias: ['source']

};
