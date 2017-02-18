export default function author () {
  return {
    name: 'author',

    parse (text) {
      return text.trim()
    },
  }
}
