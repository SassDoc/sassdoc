const path = require('path');
const chalk = require('chalk');
const vfs = require('vinyl-fs');
const through = require('through2');
const sassdoc = require('../src/sassdoc');

function devLog(...args) {
  args.unshift(chalk.styles.inverse.open)
  args.push(chalk.styles.inverse.close);
  console.log(...args);
}

function inspect() {
  let count = 0;

  return through.obj((chunk, enc, cb) => {
    count++;
    cb(null, chunk);
  }, (cb) => {
    devLog(`develop:stream:count:${count}`);
    cb();
  });
}

function documentize() {
  return sassdoc('./test/data', { verbose: true })
    .then(() => {
      devLog('develop:documentize:end');
    });
}

function stream() {
  let parse = sassdoc({ verbose: true });

  vfs.src('./test/data/**/*.scss')
    .pipe(parse)
    .on('end', () => {
      devLog('develop:stream:end');
    })
    .pipe(inspect())
    .on('data', () => {});

  return parse.promise.then(() => {
    devLog('develop:stream:promise:end');
  });
}

(async function () {
  try {
    await documentize();
    await stream();
  }
  catch (err) {
    console.error(err);
  }
}());
