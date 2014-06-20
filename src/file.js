/**
 * Dependencies
 */
var FS     = require('fs');
var rimraf = require('rimraf');
var Swig   = require('swig');
var Q      = require('q');

var Parser = new (require('./parser')).parser();
var Regex  = new (require('./regex')).regex();
var Utils  = new (require('./utils')).utils();

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
  return exports.folder.remove(folder)
    .then(function() {
      return exports.folder.create(folder);
    }, function () {
      return exports.folder.create(folder);
    });
};

/**
 * Parse a folder
 * @param  {string} folder
 * @param  {string} destination
 * @return {promise}
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
 * @param  {string} file
 * @param  {string} destination
 * @return {promise}
 */
module.exports.file.process = function (source, destination, file) {
  return exports.file.read(source + '/' + file, 'utf-8')
    .then(function (data) {
      return exports.file.generate(destination + '/' + file.replace('.scss', '.html'), exports.file.parse(data));
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

  return exports.file.create(destination, template({
    data: data,
    title: destination
  }));
};

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
 * Build index
 * @param  {string} destination
 * @return {promise}
 */
module.exports.buildIndex = function (destination) {
  return exports.folder.read(destination)
    .then(function (files) {

      for (var i = 0; i < files.length; i++) {
        if (exports.isDirectory(destination + '/' + files[i])) {
          files = files.splice(i, 1);
        }
      }

      var template = Swig.compileFile(__dirname + '/../assets/templates/index.html.swig');

      return exports.file.create(destination + '/index.html', template({ files: files }));
    }, function (err) {
      console.log(err);
    });
};

/**
 * Dump CSS
 * @param  {string} destination
 * @return {promise}
 */
module.exports.dumpAssets = function (destination) {
  destination = __dirname + '/../' + destination + '/css';

  return exports.folder.create(destination)
    .then(function () {
      return exports.file.copy(__dirname + '/../assets/css/styles.css', destination + '/styles.css')
    });
};