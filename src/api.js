var file = require('./file');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  // Create destination folder
  file.createFolder(destination, function () {    
    // Copy CSS file to destination folder
    file.copyCSS(destination);

    // Parse source folder
    file.parseFolder(source, destination);
  });
};