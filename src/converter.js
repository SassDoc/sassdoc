let path = require('path');
let cp = require('child_process');
let semver = require('semver');
let semverRegex = require('semver-regex');
let through = require('through2');
let vfs = require('vinyl-fs');

import * as utils from './utils';
import Logger from './logger';

let which = utils.denodeify(require('which'));
let rmdir = utils.denodeify(require('rimraf'));

/**
 * Execute command in a child process.
 *
 * @see {@link http://nodejs.org/api/child_process.html}
 * @param {String} command
 * @param {Array} args
 * @return {Promise}
 */
function exec(command, ...args) {
  let deferred = utils.defer();
  let childProcess;

  args.push((err, stdout, stderr) => {
    if (err) {
      deferred.reject(Object.assign(err, {
        message: `${err.message} "${command}" exited with error code ${err.code}`,
        stdout,
        stderr,
      }));
    } else {
      deferred.resolve({
        childProcess,
        stdout,
        stderr,
      });
    }
  });

  childProcess = cp.exec(command, ...args);

  // process.nextTick(() => {
  //   deferred.notify(childProcess);
  // });

  return deferred.promise;
}

/**
 * Convert file Buffer from Sass to SCSS syntax.
 *
 * @param {Buffer} file - Vinyl file
 * @param {String} enc - encoding
 */
function convertFile(file, enc) {
  let deferred = utils.defer();
  let args = ['--from', 'sass', '--to', 'scss', '--stdin', '--no-cache'];
  let cmd = cp.spawn('sass-convert', args);
  let converted;

  cmd.stdin.setEncoding(enc);
  cmd.stdin.write(file.contents);
  cmd.stdin.end();

  cmd.stdout.setEncoding(enc);
  cmd.stdout.on('data', data => {
    converted = data;
  });

  cmd.on('error', err => {
    deferred.reject(err);
  });

  cmd.on('close', (code, signal) => {
    if (code === 0) {
      deferred.resolve(converted);
    }
  });

  return deferred.promise;
}

/**
 * Returns whether file is a Sass file (indented syntax).
 *
 * @param {Buffer} file - Vinyl file
 * @return {Boolean}
 */
function isSassFile(file) {
  return path.extname(file.path).endsWith('sass');
}

/**
 * Return a transform stream meant to be piped in a stream of SCSS
 * files. Each Sass files will be converted to SCSS syntax.
 *
 * @return {Object}
 */
export default function stream() {
  return through.obj((chunk, enc, cb) => {
    if (!chunk.isBuffer() || !isSassFile(chunk)) {
      // Pass-through.
      return cb(null, chunk);
    }

    // It's a Sass file, let's convert it.
    convertFile(chunk, enc)
      .then(data => {
        chunk.contents = new Buffer(data);
        cb(null, chunk);
      }, err => {
        cb(err);
      });
  });
}

/**
 * Custom error object for binary check.
 *
 * @param {String} message
 */
class BinaryError extends Error {
  constructor(message) {
    super(message);
    // http://bit.ly/1yMzARU
    this.message = message || 'SassDoc could not find any executable for ' +
                              '"sass-convert". Operation Aborted.';
  }
  get name() {
    return 'BinaryError';
  }
}

/**
 * Custom error object for version check.
 *
 * @param {String} message
 */
class VersionError extends Error {
  constructor(message) {
    super(message);
    // http://bit.ly/1yMzARU
    this.message = message || 'Invalid "sass-convert" version, must be >=3.4.5';
  }
  get name() {
    return 'VersionError';
  }
}
