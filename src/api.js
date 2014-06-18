var fs = require('fs');
var helpers = require('./helpers');
var fileHelpers = require('./file');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  // Create destination folder
  fileHelpers.createFolder(destination, function () {    
    // Copy CSS file to destination folder
    this.copyCSS(destination);

    // Parse source folder
    this.readFolder(source, destination);
  }.bind(this));
};

module.exports.readFolder = function (source, destination) {
  var path, 
      self = this;

  // Read folder
  fs.readdir(source, function (err, files) {
    if (err) throw err;

    // Loop through all items from folder
    files.forEach(function (file) {
      path = source + '/' + file;
      var isFolder = fs.lstatSync(path).isDirectory();

      // Skip dotfiles
      if (file.charAt(0) === '.') return;

      // If it's a folder, go recursive
      if (isFolder) {
        self.readFolder(path, destination + '/' + file);
      }

      // Else parse it
      else {
        // If not a SCSS file, break
        if (helpers.getExtension(file) !== "scss") return;

        // Process file
        fileHelpers.processFile(file, source, destination);
      }
    });

    self.buildIndex(destination, files);

  });
};

// Copy the CSS file from the assets folder to the dist folder
module.exports.copyCSS = function (destination) {
  var cssFolder = destination + '/css';

  // Create CSS folder
  fileHelpers.createFolder(cssFolder, function () {
    fileHelpers.copyFile('./assets/css/styles.css', cssFolder + '/styles.css');
  });
};

// Build index page
module.exports.buildIndex = function (destination, files) {
  // Loop over files
  for (var i = 0; i < files.length; i++) {
    // Remove dotfiles
    if (files[i].charAt(0) === '.') {
      files.splice(i, 1);
    }

    // Is a file
    if (files[i].indexOf('.') > 0) {
      files[i].replace('.scss', '.html');
    }

    // Is a folder
    else {
      files[i] += '/index.html';
    }
  }

  // Write index file
  fileHelpers.writeFile(destination, 'index.html', '/../assets/templates/index.html.swig', {
    files: files,
    base_class: 'sassdoc'
  });
};