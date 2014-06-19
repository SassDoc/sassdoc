var file = require('./file');

/**
 * Main API function, running the whole thing
 * 1. Create destination folder
 * 2. Copy CSS file to destination folder
 * 3. Parse source folder
 * @param {string} source - Source folder
 * @param {string} destination - Destination folder
 * @example
 * documentize('examples/sass', 'examples/dist')
 * @returns {undefined} Doesn't return anything
 */

module.exports.documentize = function (source, destination) {

  file.createFolder(destination, function () { // 1
    file.copyCSS(destination);                 // 2
    file.parseFolder(source, destination);     // 3
  });

};