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
  var source = source + '/' + file,
      dest = helpers.removeExtension(destination + '/' + file) + '.html';

  // Parse file
  fs.readFile(source, 'utf-8', function (err, data) {
    if (err) throw err;

    // Generate HTML response
    var template = swig.compileFile(__dirname + '/../assets/templates/default.html.swig');
    var content = template({
      data: parser.parseFile(data),
      title: destination + '/' + file,
      base_class: 'sassdoc'
    });

    // Write output
    fs.writeFile(dest, content, function (err) {
      if (err) throw err;

      // Log
      console.log(helpers.getDateTime() + ' :: File `' + dest + '` successfully generated.');
    });
  }.bind(this));
};