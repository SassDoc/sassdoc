export default function content () {
  return {
    name: 'content',

    parse (text) {
      return text.trim()
    },

    autofill (item) {
      if (!item.content && item.context.code.indexOf('@content') > -1) {
        return ''
      }
    },

    allowedOn: ['mixin'],

    multiple: false,
  }
}
