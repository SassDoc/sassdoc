const path = require('path');
const through = require('through2');
const vfs = require('vinyl-fs');

/**
 * Return a transform stream recursing through directory to yield
 * Sass/SCSS files instead.
 *
 * @return {Object}
 */
export default function recurse() {
  return through.obj(function (file, enc, cb) {
    if (file.isBuffer()) {
      // Pass-through.
      return cb(null, file);
    }

    if (!file.isDirectory()) {
      // Don't know how to handle this object.
      return cb(new Error('Unsupported stream object.'));
    }

    // It's a directory, find inner Sass/SCSS files.
    let pattern = path.resolve(file.path, '**/*.+(sass|scss)');

    vfs.src(pattern)
      .pipe(through.obj((file, enc, cb) => {
        // Append to "parent" stream.
        this.push(file);
        cb();
      }, () => {
        // All done.
        cb();
      }));
  });
}
