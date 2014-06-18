var fs = require('fs');
var helpers = require('./helpers');
var parser = require('./parser');
var swig  = require('swig');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  // Read folder
  fs.readdir(source, function (err, files) {
    if (err) throw err;

    // Test whether destination exists
    this.generateFolder(destination);

    // Loop over the files
    files.forEach(function (file) {
      // If not a SCSS file, break
      if (helpers.getExtension(file) !== "scss") {
        return;
      }

      // Process the file
      this.processFile(file, source, destination);
    }.bind(this));

    // Copy CSS into dist folder
    this.copyCSS(destination);

    // Build index
    this.buildIndex(destination, files);
  }.bind(this));
};

// Copy the CSS file from the assets folder to the dist folder
module.exports.copyCSS = function (destination) {
  var folderName = 'css';
  this.generateFolder(destination + '/' + folderName);
  fs.createReadStream('./assets/' + folderName + '/styles.css').pipe(fs.createWriteStream(destination + '/' + folderName + '/styles.css'));
};

// Test if folder exists
// If it doesn't, create it
module.exports.generateFolder = function (folder) {
  // Test whether destination exists
  fs.exists(folder, function (exists) {
    if (exists) return;

    // If it doesn't exist, create it
    fs.mkdir(folder, function () {
      console.log(helpers.getDateTime() + ' :: Folder `' + folder + '` successfully created.');
    });
  });
};

// Read, parse then write a file
module.exports.processFile = function (file, source, destination) {
  var dest = destination + '/' + file;

  // Parse file
  fs.readFile(source + '/' + file, 'utf-8', function (err, data) {
    if (err) throw err;

    this.writeFile(dest, '/../assets/templates/file.html.swig', {
      data: parser.parseFile(data),
      title: dest,
      base_class: 'sassdoc'
    });

  }.bind(this));
};

module.exports.writeFile = function (destination, template, data) {
  var dest = helpers.removeExtension(destination) + '.html';
  var tmp = swig.compileFile(__dirname + template);
  var content = tmp(data);

  fs.writeFile(destination, content, function (err) {
    if (err) throw err;

    // Log
    console.log(helpers.getDateTime() + ' :: File `' + dest + '` successfully generated.');
  });
};

module.exports.buildIndex = function (destination, files) {
  files = files.map(function (file) {
    return helpers.removeExtension(file) + '.html';
  });

  this.writeFile(destination + '/index.html', '/../assets/templates/index.html.swig', {
    files: files,
    base_class: 'sassdoc'
  });
};