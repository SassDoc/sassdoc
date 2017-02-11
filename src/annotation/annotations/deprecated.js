export default function deprecated () {

  return {
    name: 'deprecated',

    parse (text) {
      return text.trim()
    },

    multiple: false,
  }
}
