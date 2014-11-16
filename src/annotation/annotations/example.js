/**
 * `@example` is a multiline annotation.
 * Check if there is something on the first line and use it as the type information.
 *
 * @example html - description
 * <div></div>
 */

let descRegEx = /(\w+)\s*(?:-?\s*(.*))/;

export default function (config) {

  return {
    name: 'example',

    parse(text) {
      let example = {
        type: 'scss', // Default to scss
        code: text
      };

      // Get the optional type info.
      let optionalType = text.substr(0, text.indexOf('\n'));

      if (optionalType.trim().length !== 0) {
        let typeDesc = descRegEx.exec(optionalType);
        example.type = typeDesc[1];
        if (typeDesc[2].length !== 0) {
          example.description = typeDesc[2];
        }
        example.code = text.substr(optionalType.length + 1); // Remove the type
      }

      // Remove all leading/trailing line breaks.
      example.code = example.code.replace(/^\n|\n$/g, '');

      return example;
    }
  }

};
