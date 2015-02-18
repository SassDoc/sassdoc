import path from 'path';
import chalk from 'chalk';
import dateformat from 'dateformat';
import vfs from 'vinyl-fs';
import through from 'through2';
import sassdoc from '../src/sassdoc';

function devLog(...args) {
  console.log(...[
    chalk.styles.inverse.open,
    `[${dateformat(new Date(), 'HH:MM:ss')}]`,
    ...args,
    chalk.styles.inverse.close
  ]);
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
