var fs = require('fs');
var swig  = require('swig');
var Utils = new (require('./utils')).utils();
var parser = require('./parser');
var Q = require('q');
var __self = this;

/**
 * Denodeified fs functions through Q, stored in module
 */
module.exports.readFile = Q.denodeify(fs.readFile);
module.exports.writeFile = Q.denodeify(fs.writeFile);
module.exports.mkdir = Q.denodeify(fs.mkdir);
module.exports.readdir = Q.denodeify(fs.readdir);
module.exports.exists = Q.denodeify(fs.exists);

/**
 * Test if folder exists; if it doesn't, create it
 * @param {string} folder     - folder to be created
 * @param {function} callback - function to be executed once folder is created
 * @return {undefined}
 */
module.exports.createFolder = function (folder, callback) {
  // Test whether destination exists
  __self.exists(folder, function (exists) {
    // If it exists, execute callback
    if (exists && typeof callback === "function") {
      callback();
      return;
    }

    // If it doesn't exist, create it
    __self.mkdir(folder).done(function () {
      console.log(Utils.getDateTime() + ' :: Folder `' + folder + '` successfully created.');

      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

/**
 * Write a file using a Swig template
 * @param  {string} destination - destination folder
 * @param  {string} file        - source file name
 * @param  {string} template    - template file
 * @param  {object} data        - data to pass to view
 * @return {undefined}
 */
module.exports.createFile = function (destination, file, template, data) {
  var dest = (destination + '/' + file).replace('.scss', '.html'),
      tmp = swig.compileFile(__dirname + '/../assets/templates/' + template);

  // Make sure folder exists
  __self.createFolder(destination, function () {
    // Write file
    __self.writeFile(dest, tmp(data)).done(function () {
      // Log success
      console.log(Utils.getDateTime() + ' :: File `' + dest + '` successfully generated.');
    });
  });
};

/**
 * Read, parse then write a file
 * @param  {string} file        - file to be parsed
 * @param  {string} source      - source folder
 * @param  {string} destination - destination folder
 * @return {undefined}
 */
module.exports.processFile = function (file, source, destination) {
  var dest = destination + '/' + file;

  // Parse file
  __self.readFile(source + '/' + file, 'utf-8').done(function (data) {
    __self.createFile(destination, file, 'file.html.swig', {
      data: parser.parseFile(data),
      title: dest,
      base_class: 'sassdoc',
      asset_path: Utils.assetPath(destination, 'css/styles.css')
    });
  });
};

/**
 * Copy a file
 * @param  {string} source
 * @param  {string} destination
 * @return {undefined}
 */
module.exports.copyFile = function (source, destination) {
  fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};

/**
 * Copy the CSS file from the assets folder to the dist folder
 * @param  {string} destination - destination folder
 * @return {undefined}
 */
module.exports.copyCSS = function (destination) {
  var cssFolder = destination + '/css';

  // Create CSS folder
  __self.createFolder(cssFolder, function () {
    __self.copyFile('./assets/css/styles.css', cssFolder + '/styles.css');
  });
};

/**
 * Build index page
 * @param  {string} destination - destination folder
 * @param  {array} files        - array of file names
 * @return {undefined}
 */
module.exports.buildIndex = function (destination) {
  __self.recursiveLookUp(destination, function (err, results) {
    console.log(results);
    // Write index file
  });
};

/**
 * Recursive look up on a directory
 * @param {string} destination - destination folder
 * @param {function} callback  - callback function
 * @returns {array}              array of files
 */
module.exports.recursiveLookUp = function (destination, callback) {
  var results = [];

  __self.readdir(destination).done(function (files) {
    var pending = files.length;

    if (!pending) {
      return callback(null, results);
    }

    files.forEach(function (file) {
      file = destination + '/' + file;

      fs.stat(file, function(err, stat) {
        // Directory
        if (stat && stat.isDirectory()) {
          __self.recursiveLookUp(file, function(_files) {
            results = results.concat(_files);
            if (!--pending) {
              callback(null, results);
            }
          });

        // File
        } else {
          results.push(file);
          if (!--pending) {
            callback(null, results);
          }
        }
      });
    });
  });
};

/**
 * Parse a folder of files
 * @param  {string} source      - folder to be parsed
 * @param  {string} destination - destination folder
 * @return {undefined}
 */
module.exports.parseFolder = function (source, destination) {
  var path, promises = [];

  // Read folder
  __self.readdir(source).done(function (files) {

    // Loop through all items from folder
    files.forEach(function (file) {
      path = source + '/' + file;
      var isFolder = fs.lstatSync(path).isDirectory();

      // Skip dotfiles
      if (file.charAt(0) === '.') return;

      // If it's a folder, go recursive
      if (isFolder) {
        __self.parseFolder(path, destination + '/' + file);
      }

      // Else parse it
      else {
        // If not a SCSS file, break
        if (Utils.getExtension(file) !== "scss") return;

        promises.push(function () {
          return Q.fcall(function() {
            __self.processFile(file, source, destination);
          })
        });
      }
    });

    Q.all(promises).then(function () {
      __self.buildIndex(destination);
    });

  });
};