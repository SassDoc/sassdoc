import through from 'through2'
import minimatch from 'minimatch'

/**
 * @param {Array} patterns
 * @return {Object}
 */
export default function exclude (patterns) {
  return through.obj((file, enc, cb) => {
    if (Array.find(patterns, x => minimatch(file.relative, x))) {
      return cb()
    }

    cb(null, file)
  })
}
