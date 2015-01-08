let path = require('path');
let vfs = require('vinyl-fs');
let through = require('through2');
let sassdoc = require('../src/sassdoc').default;

function inspect() {
  let count = 0;

  return through.obj((chunk, enc, cb) => {
    count++;
    cb(null, chunk);
  }, (cb) => {
    console.log(count);
    cb();
  });
}

function documentize() {
  let sd = sassdoc('./SassyStrings', { verbose: true });

  return sd.documentize()
    .then(() => {
      console.log('yeah!');
    });
}

function stream() {
  let sd = sassdoc({ verbose: true });

  return vfs.src('./SassyStrings/**/*.scss')
    .pipe(sd.stream())
    .pipe(inspect())
    .on('data', () => {});
}

(async function () {
  await documentize();
  await stream();
}());
