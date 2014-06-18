var _file = require('./file');

// Main API function
// Run the whole thing
module.exports.documentize = function (source, destination) {
  // Create destination folder
  _file.createFolder(destination, function () {    
    // Copy CSS file to destination folder
    _file.copyCSS(destination);

    // Parse source folder
    _file.readFolder(source, destination);
  });
};