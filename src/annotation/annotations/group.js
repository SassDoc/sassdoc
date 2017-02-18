export default function group () {
  return {
    name: 'group',

    parse (text) {
      return [text.trim().toLowerCase()]
    },

    default () {
      return ['undefined']
    },

    multiple: false,
  }
}
