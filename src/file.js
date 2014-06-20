var fs = require('fs');
var swig  = require('swig');
var Utils = new (require('./utils')).utils();
var Parser = require('./parser');
var Q = require('q');
var __self = this;

/**
 * Denodeified fs functions through Q, stored in module
 */
module.exports.folder = {};
module.exports.folder.create = Q.denodeify(fs.mkdir);
module.exports.folder.remove = Q.denodeify(fs.rmdir);
module.exports.folder.read = Q.denodeify(fs.readdir);

module.exports.file = {};
module.exports.file.read = Q.denodeify(fs.readFile);
module.exports.file.create = Q.denodeify(fs.writeFile);
module.exports.file.remove = Q.denodeify(fs.unlink);
module.exports.file.parse = Parser.parseFile;

module.exports.file.copy = function (source, destination) {
  fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

module.exports.folder.refresh = function (folder) {
  return __self.folder.remove(folder)
    .then(function() {
      return __self.folder.create(folder);
    }, function (err) {
      return __self.folder.create(folder);
    });
};

module.exports.folder.parse = function (folder, destination) {
  return __self.folder.read(folder)
    .then(function (files) {
      var promises = [];

      files.forEach(function (file) {
        var path = folder + '/' + file,
            isDirectory = fs.lstatSync(path).isDirectory(),
            func = isDirectory ? 'parse' : 'process';

        promises.push(__self.file[func](path, destination));
      });

      return Q.all(promises);

    }, function (err) {
      console.log(err);
    })
};

module.exports.file.process = function (file, destination) {
  return __self.file.read(file, 'utf-8')
    .then(function (data) {
      var content = __self.file.parse(data);

      return __self.file.generate(destination + '/' + file, content);
    });
};

module.exports.file.generate = function (destination, data) {
  var template = swig.compileFile(__dirname + '/../assets/templates/file.html.swig');

  return __self.file.create(destination, template(data));
};

