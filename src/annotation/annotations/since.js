const sinceRegEx = /\s*([^\s]*)\s*(?:-?\s*([\s\S]*))?\s*$/

export default function since () {
  return {
    name: 'since',

    parse (text) {
      let parsed = sinceRegEx.exec(text)
      let obj = {}

      if (parsed[1]) {
        obj.version = parsed[1]
      }

      if (parsed[2]) {
        obj.description = parsed[2]
      }

      return obj
    },
  }
}
