export default function type () {
  return {
    name: 'type',

    parse (text) {
      return text.trim()
    },

    allowedOn: ['variable'],

    multiple: false,
  }
}
