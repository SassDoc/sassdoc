let through = require('through2');
let minimatch = require('minimatch');

/**
 * @param {Array} patterns
 * @return {Object}
 */
export default function exclude(patterns) {
  return through.obj((chunk, enc, cb) => {
    if (patterns.find(x => minimatch(chunk.relative, x))) {
      return cb();
    }

    cb(null, chunk);
  });
}
