let path = require('path');
let through = require('through2');
let vfs = require('vinyl-fs');

/**
 * Return a transform stream recursing through directory to yield
 * Sass/SCSS files instead.
 *
 * @return {Object}
 */
export default function recurse() {
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
