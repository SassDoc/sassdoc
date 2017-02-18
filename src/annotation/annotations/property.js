const reqRegEx = /\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:\[([^\]]*)\])?\s*(?:-?\s*([\s\S]*))\s*$/

export default function property () {
  return {
    name: 'property',

    parse (text) {
      let match = reqRegEx.exec(text.trim())

      let obj = {
        type: match[1] || 'Map',
      }

      if (match[2]) {
        obj.name = match[2]
      }

      if (match[3]) {
        obj.default = match[3]
      }

      if (match[4]) {
        obj.description = match[4]
      }

      return obj
    },

    alias: ['prop'],

    allowedOn: ['variable'],
  }
}
