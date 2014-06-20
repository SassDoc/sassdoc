/**
 * External dependencies
 */
var fs     = require('fs');
var rimraf = require('rimraf');
var swig   = require('swig');
var Q      = require('q');
var parser = require('./parser');

/**
 * Folder API
 */
module.exports.folder = {};
module.exports.folder.read   = Q.denodeify(fs.readdir);
module.exports.folder.create = Q.denodeify(fs.mkdir);
module.exports.folder.remove = Q.denodeify(rimraf);

/**
 * File API
 */
module.exports.file = {};
module.exports.file.read   = Q.denodeify(fs.readFile);
module.exports.file.create = Q.denodeify(fs.writeFile);
module.exports.file.remove = Q.denodeify(fs.unlink);

/**
 * Test if path is a directory
 * @param  {String}  path
 * @return {Boolean}
 */
module.exports.isDirectory = function (path) {
  return fs.lstatSync(path).isDirectory();
};

/**
 * Remove then create a folder
 * @param  {String} folder
 * @return {Q.Promise}
 */
module.exports.folder.refresh = function (folder) {
  return exports.folder.remove(folder)
    .then(function() {
      return exports.folder.create(folder);
    }, function () {
      return exports.folder.create(folder);
    });
};

/**
 * Parse a folder
 * @param  {String} folder
 * @param  {String} destination
 * @return {Q.Promise}
 */
module.exports.folder.parse = function (folder, destination) {
  return exports.folder.read(folder)
    .then(function (files) {
      var promises = [];

      files.forEach(function (file) {
        var path = folder + '/' + file;

        if (exports.isDirectory(path)) {
          promises.concat(exports.folder.parse(path, destination));
        }

        else {
          promises.push(exports.file.process(folder, destination, file));
        }
      });

      return Q.all(promises);

    }, function (err) {
      console.log(err);
    })
};

/**
 * Process a file
 * @param  {String} file
 * @param  {String} destination
 * @return {Q.Promise}
 */
module.exports.file.process = function (source, destination, file) {
  return exports.file.read(source + '/' + file, 'utf-8')
    .then(function (data) {
      return exports.file.generate(destination + '/' + file.replace('.scss', '.html'), exports.file.parse(data));
    });
};

/**
 * Generate a file with swig
 * @param  {String} destination
 * @param  {Array} data
 * @return {Q.Promise}
 */
module.exports.file.generate = function (destination, data) {
  var template = swig.compileFile(__dirname + '/../assets/templates/file.html.swig');

  return exports.file.create(destination, template({
    data: data,
    title: destination
  }));
};

/**
 * Copy a file
 * @param  {String} source
 * @param  {String} destination
 * @return {Q.Promise}
 */
module.exports.file.copy = function (source, destination) {
  return fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

/**
 * Parse a file
 * @return {Array}
 */
module.exports.file.parse = function (file) {
  return parser.parseFile(file);
};

/**
 * Build index
 * @param  {String} destination
 * @return {Q.Promise}
 */
module.exports.buildIndex = function (destination) {
  return exports.folder.read(destination)
    .then(function (files) {

      for (var i = 0; i < files.length; i++) {
        if (exports.isDirectory(destination + '/' + files[i])) {
          files = files.splice(i, 1);
        }
      }

      var template = swig.compileFile(__dirname + '/../assets/templates/index.html.swig');

      return exports.file.create(destination + '/index.html', template({ files: files }));
    }, function (err) {
      console.log(err);
    });
};

/**
 * Dump CSS
 * @param  {String} destination
 * @return {Q.Promise}
 */
module.exports.dumpAssets = function (destination) {
  destination = __dirname + '/../' + destination + '/css';

  return exports.folder.create(destination)
    .then(function () {
      return exports.file.copy(__dirname + '/../assets/css/styles.css', destination + '/styles.css')
    });
};