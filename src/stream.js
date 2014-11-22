let path = require('path');
let through = require('through2');
let vfs = require('vinyl-fs');
let utils = require('./utils');

/**
 *
 *
 * @param {Object} parser
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
 * Read source directory.
 * Returns a Readable/Writable stream of vinyl File objects.
 *
 * @param {String} src
 */
export function read(src) {
  return vfs.src(src);
}

/**
 * Recurse through source directory.
 */
export function recurse() {
  return through.obj(function (chunk, enc, cb) {
    if (chunk.isBuffer()) {
      // Pass-through.
      cb(null, chunk);
    }

    if (!chunk.isDirectory()) {
      // Don't know how to handle this object.
      cb(new Error('Unsupported stream object.'));
    }

    else {
      globSass(chunk.path, all => {
        all.forEach(file => {
          this.push(file);
        });
        cb();
      });
    }
  });
}

/**
 * Match and stream Sass files from source directory.
 *
 * @param {String} dir
 * @param {Function} callback
 */
function globSass(dir, callback) {
  let pattern = path.resolve(dir, '**/*.+(sass|scss)');
  let all = [];

  vfs.src(pattern)
    .pipe(through.obj((chunk, enc, cb) => {
      cb(null, chunk);
    }))
    .on('data', data => {
      all.push(data);
    })
    .on('end', () => {
      callback(all);
    });
}

/**
 * Parse a single file.
 *
 * @param {Buffer} file
 * @param {String} enc
 * @param {Object} parser
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
