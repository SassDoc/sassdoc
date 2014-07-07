'use strict';

/**
 * @example is a multiline annotation
 * check if there is something on the first line and use it as the type information
 *
 * @example html
 * <div></div>
 */
module.exports = function (text) {
  var example = {
    type: 'scss', // Default to scss
    code: text
  };

  // Get the optional type info
  var optionalType = text.substr(0, text.indexOf('\n'));

  if (optionalType.length !== 0) {
    example.type = optionalType;
    example.code = text.substr(optionalType.length + 1); // Remove the type
  }

  // remove all leading/trailing line breaks.
  example.code = example.code.replace(/^\n|\n$/g, '');
  return example;
};