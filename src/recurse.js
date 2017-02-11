import { is } from './utils'
import path from 'path'
import through from 'through2'
import vfs from 'vinyl-fs'

/**
 * Return a transform stream recursing through directory to yield
 * Sass/SCSS files instead.
 *
 * @return {Object}
 */
export default function recurse () {
  return through.obj(function (file, enc, cb) {
    if (!is.vinylFile(file)) {
      // Don't know how to handle this object.
      return cb(new Error('Unsupported stream object. Vinyl file expected.'))
    }

    if (file.isBuffer() || file.isStream()) {
      // Pass-through.
      return cb(null, file)
    }

    if (!file.isDirectory()) {
      // At that stage we want only dirs. Dismiss file.isNull.
      return cb()
    }

    // It's a directory, find inner Sass/SCSS files.
    let pattern = path.resolve(file.path, '**/*.+(sass|scss)')

    vfs.src(pattern)
      .pipe(through.obj((file, enc, cb) => {
        // Append to "parent" stream.
        this.push(file)
        cb()
      }, () => {
        // All done.
        cb()
      }))
  })
}
