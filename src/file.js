'use strict';

var fs = require('fs');          // File system
var mkdirp = require('mkdirp');  // mkdir -p
var Q = require('q');            // Promises
var path = require('path');      // Path

var Parser = require('./parser');

var sorter = require('./sorter');
var utils = require('./utils');
var logger = require('./log');

exports = module.exports = {

  /**
   * Folder API
   */
  folder: {
    /**
     * Store project base directory.
     */
    base: '',

    /**
     * Read a folder.
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_readdir_path_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    read: Q.denodeify(fs.readdir),

    /**
     * Create a folder.
     * @see {@link https://github.com/substack/node-mkdirp}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    create: Q.denodeify(mkdirp),

    /**
     * Parse a folder.
     * @param  {String} folder
     * @param  {Object} parser
     * @return {Q.Promise}
     */
    parse: function (folder, parser) {
      return exports.folder.read(folder).then(function (files) {
        var filePath;
        var promises = [];
        var data = [];

        files.forEach(function (file) {
          filePath = folder + '/' + file;

          // Folder
          if (exports.isDirectory(filePath)) {
            promises.push(exports.folder.parse(filePath, parser).then(function (response) {
              data = data.concat(response);
            }));
          }

          // SCSS file
          else if (utils.getExtension(filePath) === 'scss') {
            promises.push(exports.file.process(filePath, parser).then(function (response) {
              if (Object.keys(response).length > 0) {
                data = data.concat(response);
              }
            }));
          }

          // Ignored file
          else {
            logger.log('File `' + filePath + '` is not a `.scss` file. Omitted.');
          }
        });

        return Q.all(promises).then(function () {
          return data;
        });

      }, function (err) {
        throw new Error(err);
      });
    }
  },

  /**
   * File API
   */
  file: {
    /**
     * Read a file.
     * @see {@link http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback}
     * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#interfacing-with-nodejs-callbacks}
     */
    read: Q.denodeify(fs.readFile),

    /**
     * Process a file.
     * @param  {String} file
     * @param  {Object} parser
     * @return {Q.Promise}
     */
    process: function (file, parser) {
      return exports.file.read(file, 'utf-8').then(function (code) {
        var data = parser.parse(code);

        // Merge in from which file the comments where loaded.
        Object.keys(data).forEach(function (key) {
          data[key].forEach(function (item) {
            item.file = {
              path: path.relative(exports.folder.base, file),
              name: path.basename(file, '.scss')
            };
          });
        });

        return data;
      });
    }
  },

  /**
   * Test if path is a directory.
   * @param  {String}  path
   * @return {Boolean}
   */
  isDirectory: function (path) {
    return fs.statSync(path).isDirectory();
  },

  /**
   * Get data.
   * @param {String} folder - folder path
   * @param {Array} annotations - Additional annotations to use
   * @param {Object} view - view configuration
   */
  getData: function (folder, annotations, view) {
    var parser = new Parser(view);
        parser.annotations.addAnnotations(annotations);

    exports.folder.base = folder;

    // Parse the whole folder.
    return exports.folder.parse(folder, parser)
      // Extract all items into a structure like https://gist.github.com/FWeinb/6b16c4fc85667ae6c1b5
      .then(function (data) {
        var byTypeAndName = {};

        data.forEach(function (obj) {
          Object.keys(obj).forEach(function (type) {
            // Ignore unkown type
            if (type === 'unknown') {
              return;
            }
            if (!utils.isset(byTypeAndName[type])) {
              byTypeAndName[type] = {};
            }
            obj[type].forEach(function (item) {
              byTypeAndName[type][item.context.name] = item;
            });
          });
        });
        return byTypeAndName;
      })
      // Run the postProcessor
      .then(parser.postProcess.bind(parser))
      .then(sorter.postProcess);
  }
};
