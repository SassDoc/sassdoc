const typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:-?\s*([\s\S]*))?/

export default function return_ (env) {
  return {
    name: 'return',

    parse (text, info, id) {
      let parsed = typeRegEx.exec(text)
      let obj = {}

      if (parsed[1]) {
        obj.type = parsed[1]
      } else {
        env.logger.warn(`@return must at least have a type. Location: ${id}:${info.commentRange.start}:${info.commentRange.end}`)
        return undefined
      }

      if (parsed[2]) {
        obj.description = parsed[2]
      }

      return obj
    },

    alias: ['returns'],

    allowedOn: ['function'],

    multiple: false,
  }
}
