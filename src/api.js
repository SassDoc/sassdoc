var fs  = require('./file');
var log = require('./log');

exports = module.exports = {
  /**
   * Main API function, running the whole thing
   * @param {String} source - Source folder
   * @param {String} destination - Destination folder
   * @example
   * documentize('examples/sass', 'examples/dist')
   */
  documentize: function (source, destination) {
    fs.folder.refresh(destination)
      .then(function () { 
        log.log('Folder `' + destination + '` successfully generated.');
        return fs.folder.parse(source, destination)
      })
      .then(function () { 
        log.log('Folder `' + source + '` successfully parsed.');
        return fs.buildIndex(destination) 
      })
      .then(function () { 
        log.log('Index for folder `' + source + '` successfully generated.');
        return fs.dumpAssets(destination) 
      })
      .then(function () {
        log.log('Process over. Everything okay!');
      }).fail(function (err) {
        console.log(err);
      });
  }

};
