export default function todo () {
  return {
    name: 'todo',

    parse (text) {
      return text.trim()
    },

    alias: ['todos'],
  }
}
