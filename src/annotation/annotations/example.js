/**
 * `@example` is a multiline annotation.
 *
 * Check if there is something on the first line and use it as the type information.
 *
 * @example html - description
 * <div></div>
 */

const stripIndent = require('strip-indent')
const descRegEx = /(\w+)\s*(?:-?\s*(.*))/

export default function example () {
  return {
    name: 'example',

    parse (text) {
      let instance = {
        type: 'scss', // Default to `scss`.
        code: text,
      }

      // Get the optional type info.
      let optionalType = text.substr(0, text.indexOf('\n'))

      if (optionalType.trim().length !== 0) {
        let typeDesc = descRegEx.exec(optionalType)
        instance.type = typeDesc[1]
        if (typeDesc[2].length !== 0) {
          instance.description = typeDesc[2]
        }
        instance.code = text.substr(optionalType.length + 1) // Remove the type
      }

      // Remove all leading/trailing line breaks.
      instance.code = instance.code.replace(/^\n|\n$/g, '')

      instance.code = stripIndent(instance.code)

      return instance
    },
  }
}
