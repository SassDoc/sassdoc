var fs = require('fs');
var swig  = require('swig');
var helpers = require('./helpers');
var parser = require('./parser');

// Test if folder exists
// If it doesn't, create it
module.exports.createFolder = function (folder, callback) {
  // Test whether destination exists
  fs.exists(folder, function (exists) {
    // If it exists, execute callback
    if (exists && typeof callback === "function") {
      callback();
      return;
    }

    // If it doesn't exist, create it
    fs.mkdir(folder, function () {
      console.log(helpers.getDateTime() + ' :: Folder `' + folder + '` successfully created.');

      if (typeof callback === "function") {
        callback();
      }
    });
  });
};

// Write a file
// using a template
module.exports.writeFile = function (destination, file, template, data) {
  var dest = (destination + '/' + file).replace('.scss', '.html');
  var tmp = swig.compileFile(__dirname + template);

  // Make sure folder exists
  this.createFolder(destination, function () {
    // Write file
    fs.writeFile(dest, tmp(data), function (err) {
      if (err) throw err;

      // Log success
      console.log(helpers.getDateTime() + ' :: File `' + dest + '` successfully generated.');
    });
  });
};

// Read, parse then write a file
module.exports.processFile = function (file, source, destination) {
  var dest = destination + '/' + file;

  // Parse file
  fs.readFile(source + '/' + file, 'utf-8', function (err, data) {
    if (err) throw err;

    this.writeFile(destination, file, '/../assets/templates/file.html.swig', {
      data: parser.parseFile(data),
      title: dest,
      base_class: 'sassdoc'
    });

  }.bind(this));
};

module.exports.copyFile = function (source, destination) {
  fs.createReadStream(source).pipe(fs.createWriteStream(destination));
};