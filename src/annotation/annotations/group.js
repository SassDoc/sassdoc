export default function group () {
  return {
    name: 'group',

    parse (text, info) {
      let lines = text.trim().split('\n')
      let slug = lines[0].trim().toLowerCase()
      let description = lines.splice(1).join('\n').trim()
      if (description) {
        info.groupDescriptions = info.groupDescriptions || {}
        info.groupDescriptions[slug] = description
      }
      return [slug]
    },

    default () {
      return ['undefined']
    },

    multiple: false,
  }
}
