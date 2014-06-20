var FS = require('./file');

/**
 * Main API function, running the whole thing
 * @param {string} source - Source folder
 * @param {string} destination - Destination folder
 * @example
 * documentize('examples/sass', 'examples/dist')
 * @returns {undefined} Doesn't return anything
 */

module.exports.documentize = function (source, destination) {

  FS.folder.refresh(destination)
    .then(function () {
      FS.folder.parse(source, destination)
        .then(function () {
          FS.dumpAssets(destination);
          FS.buildIndex(destination)
            .then(function () {
              console.log('Everything is okay!');
            });
        });
      });
};