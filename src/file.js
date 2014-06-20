var FS = require('fs');
var Swig  = require('swig');
var Utils = new (require('./utils')).utils();
var Parser = require('./parser');
var Q = require('q');
var __self = this;

module.exports.folder = {};
module.exports.folder.create = Q.denodeify(FS.mkdir);
module.exports.folder.remove = Q.denodeify(FS.rmdir);
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
  FS.createReadStream(source).pipe(FS.createWriteStream(destination));
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
        var path = folder + '/' + file,
            isDirectory = __self.isDirectory(path);

        if (isDirectory) {
          promises.push(__self.folder.parse(path, destination));
        }

        else {
          promises.push(__self.file.process(path, destination));
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
module.exports.file.process = function (file, destination) {
  return __self.file.read(file, 'utf-8')
    .then(function (data) {
      var content = __self.file.parse(data);

      return __self.file.generate(destination + '/' + file, content);
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

  return __self.file.create(destination, template(data));
};

