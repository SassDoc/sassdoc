let path = require('path');
let through = require('through2');
let vfs = require('vinyl-fs');
let utils = require('./utils');

/**
 * Return a transform stream meant to be piped in a stream of SCSS
 * files. Each file will be passed-through as-is, but they are all
 * parsed to generate a SassDoc data array.
 *
 * The returned stream has an additional `promise` property, containing
 * a `Promise` object that will be resolved when the stream is done and
 * the data is fulfiled.
 *
 * @param {Object} parser
 * @return {Object}
 */
export default function stream(parser) {
  let data = [];
  let deferred = utils.defer();

  function transform(chunk, enc, cb) {
    if (chunk.isBuffer()) {
      // Synchronously merge data and pass to next chunk.
      data = data.concat(parseFile(chunk, enc, parser));
      // Pass-through.
      cb(null, chunk);
    }
  }

  function flush(cb) {
    deferred.resolve(data);
    cb();
  }

  let filter = through.obj(transform, flush);
  filter.promise = deferred.promise;

  return filter;
}

/**
 * Return a transform stream of vinyl `File` objects matching given
 * `src` pattern.
 *
 * @param {String} src
 * @return {Object}
 */
export function read(src) {
  return vfs.src(src);
}

/**
 * Return a transform stream recursing through directory to yield
 * Sass/SCSS files instead.
 *
 * @return {Object}
 */
export function recurse() {
  return through.obj(function (chunk, enc, cb) {
    if (chunk.isBuffer()) {
      // Pass-through.
      return cb(null, chunk);
    }

    if (!chunk.isDirectory()) {
      // Don't know how to handle this object.
      return cb(new Error('Unsupported stream object.'));
    }

    // It's a directory, find inner Sass/SCSS files.
    let pattern = path.resolve(chunk.path, '**/*.+(sass|scss)');

    vfs.src(pattern).pipe(through.obj((chunk, enc, cb) => {
      // Pass-through.
      cb(null, chunk);

      // Append to "parent" stream.
      this.push(chunk);
    }, () => {
      // All done.
      cb();
    }));
  });
}

/**
 * Parse a single file and return the SassDoc data array.
 *
 * @param {Buffer} file
 * @param {String} enc
 * @param {Object} parser
 * @return {Array}
 */
function parseFile(file, enc, parser) {
  let fileData = parser.parse(file.contents.toString(enc));
  let data = [];

  Object.keys(fileData).forEach(type => {
    fileData[type].forEach(item => {
      item.file = {
        path: file.relative,
        name: path.basename(file),
      };

      data.push(item);
    });
  });

  return data;
}
