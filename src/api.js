var fs = require('fs');
var helpers = require('./helpers');
var fileHelpers = require('./file');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  var self = this;

  // Create destination folder
  fileHelpers.createFolder(destination, function () {
    // CSS
    self.copyCSS(destination);

    // Parse source folder
    fs.readdir(source, function (err, files) {
      // Build index
      self.buildIndex(destination, files);

      // Loop over the files
      files.forEach(function (file) {
        // If not a SCSS file, break
        if (helpers.getExtension(file) !== "scss") {
          return;
        }

        // Process file
        fileHelpers.processFile(file, source, destination);
      });
    });

  });
};

// Copy the CSS file from the assets folder to the dist folder
module.exports.copyCSS = function (destination) {
  var cssFolder = destination + '/css';

  fileHelpers.createFolder(cssFolder, function () {
    fileHelpers.copyFile('./assets/css/styles.css', cssFolder + '/styles.css');
  });
};

// Build index page
module.exports.buildIndex = function (destination, files) {
  files = files.map(function (file) {
    return helpers.removeExtension(file) + '.html';
  });

  fileHelpers.writeFile(destination + '/index.html', '/../assets/templates/index.html.swig', {
    files: files,
    base_class: 'sassdoc'
  });
};