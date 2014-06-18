var fs = require('fs');
var helpers = require('./helpers');
var fileHelpers = require('./file');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  // Read folder
  fs.readdir(source, function (err, files) {
    if (err) throw err;

    // Test whether destination exists
    fileHelpers.generateFolder(destination);

    // Loop over the files
    files.forEach(function (file) {
      // If not a SCSS file, break
      if (helpers.getExtension(file) !== "scss") {
        return;
      }

      // Process the file
      fileHelpers.processFile(file, source, destination);
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
  fileHelpers.generateFolder(destination + '/' + folderName);
  fs.createReadStream('./assets/' + folderName + '/styles.css').pipe(fs.createWriteStream(destination + '/' + folderName + '/styles.css'));
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