var fs  = require('./file');
var log = require('./log');
var utils = require('./utils');
var Q = require('q');

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
  },

  sassdoc: function (source) {
    return fs.folder.read(source).then(function (files) {
      var path, promises = [];

      files.forEach(function (file) {
        path = source + '/' + file;

        if (fs.isDirectory(path)) {
          promises.concat(fs.folder.parse(path));
        }

        else {
          if (utils.getExtension(file) === "scss") {
            promises.push(exports.parse(source, file));
          }
        }
      });

      return Q.all(promises);

    }, function (err) {
      console.log(err);
    });
  },

  parse: function (source, file) {
    return fs.file.read(source + '/' + file, 'utf-8').then(function (data) {
      return fs.file.parse(data);
    });
  }

};
