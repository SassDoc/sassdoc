var FS = require('fs');
var rimraf = require('rimraf');
var Swig  = require('swig');
var Utils = new (require('./utils')).utils();
var Parser = require('./parser');
var Q = require('q');
var __self = this;

module.exports.folder = {};
module.exports.folder.create = Q.denodeify(FS.mkdir);
module.exports.folder.remove = Q.denodeify(rimraf);
module.exports.folder.read = Q.denodeify(FS.readdir);

module.exports.file = {};
module.exports.file.read = Q.denodeify(FS.readFile);
module.exports.file.create = Q.denodeify(FS.writeFile);
module.exports.file.remove = Q.denodeify(FS.unlink);
module.exports.file.parse = Parser.parseFile;

/**
 * Copy a file
 * @param  {string} source
 * @param  {string} destination
 * @return {undefined}
 */
module.exports.file.copy = function (source, destination) {
  return FS.createReadStream(source).pipe(FS.createWriteStream(destination));
};

/**
 * Test if path is a directory
 * @param  {string}  path
 * @return {Boolean}
 */
module.exports.isDirectory = function (path) {
  return FS.lstatSync(path).isDirectory();
};

/**
 * Remove then create a folder
 * @param  {string} folder
 * @return {promise}
 */
module.exports.folder.refresh = function (folder) {
  return __self.folder.remove(folder)
    .then(function() {
      return __self.folder.create(folder);
    }, function (err) {
      return __self.folder.create(folder);
    });
};

/**
 * Parse a folder
 * @param  {string} folder
 * @param  {string} destination
 * @return {promise}
 */
module.exports.folder.parse = function (folder, destination) {
  return __self.folder.read(folder)
    .then(function (files) {
      var promises = [];

      files.forEach(function (file) {
        var path = folder + '/' + file;

        if (__self.isDirectory(path)) {
          promises.concat(__self.folder.parse(path, destination));
        }

        else {
          promises.push(__self.file.process(folder, destination, file));
        }
      });

      return Q.all(promises);

    }, function (err) {
      console.log(err);
    })
};

/**
 * Process a file
 * @param  {string} file
 * @param  {string} destination
 * @return {promise}
 */
module.exports.file.process = function (source, destination, file) {
  return __self.file.read(source + '/' + file, 'utf-8')
    .then(function (data) {
      return __self.file.generate(destination + '/' + file.replace('.scss', '.html'), __self.file.parse(data));
    });
};

/**
 * Generate a file with Swig
 * @param  {string} destination
 * @param  {array} data
 * @return {promise}
 */
module.exports.file.generate = function (destination, data) {
  var template = Swig.compileFile(__dirname + '/../assets/templates/file.html.swig');

  return __self.file.create(destination, template({
    data: data,
    title: destination,
    base_class: 'sassdoc'
  }));
};

/**
 * Build index
 * @param  {string} destination
 * @return {promise}
 */
module.exports.buildIndex = function (destination) {
  return __self.folder.read(destination)
    .then(function (files) {

      for (var i = 0; i < files.length; i++) {
        if (__self.isDirectory(destination + '/' + files)) {
          files = files.splice(i, 1);
        }
      }

      console.log(files);

      var template = Swig.compileFile(__dirname + '/../assets/templates/index.html.swig');

      return __self.file.create(destination, template({
        data: files,
        title: destination,
        base_class: 'sassdoc'
      }));

    }, function (err) {
      console.log(err);
    })
};

/**
 * Dump CSS
 * @param  {string} destination
 * @return {promise}
 */
module.exports.dumpAssets = function (destination) {
  destination = __dirname + '/../' + destination + '/css';

  return __self.folder.create(destination)
    .then(function () {
      return __self.file.copy(__dirname + '/../assets/css/styles.css', destination + '/styles.css')
    });
};