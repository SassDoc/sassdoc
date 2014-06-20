var FS = require('./file');

exports = module.exports = {

  /**
   * Main API function, running the whole thing
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @example
   * documentize('examples/sass', 'examples/dist')
   */
  documentize: function (source, destination) {
    FS.folder.refresh(destination)
      .then(function () { return FS.folder.parse(source, destination) })
      .then(function () { return FS.buildIndex(destination) })
      .then(function () { return FS.dumpAssets(destination) })
      .then(function () {
        console.log('Everything is okay!');
      }).fail(function (err) {
        console.log(err);
      });
  }

};
