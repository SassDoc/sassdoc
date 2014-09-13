'use strict';

var path = require('path');
var cp = require('child_process');
var rimraf = require('rimraf');
var Q = require('q');

var rmdir = Q.denodeify(rimraf);

/**
 * Execute a child process command.
 * @see    {@link http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback}
 * @param  {String} command
 * @param  {Object} options
 * @return {Q.Promise}
 */
function exec(command) {
  var args = Array.prototype.slice.call(arguments);
  var deferred = Q.defer();
  var childProcess;

  args.push(function (err, stdout, stderr) {
    if (err) {
      err.message += command + ' (exited with error code ' + err.code + ')';
      err.stdout = stdout;
      err.stderr = stderr;
      deferred.reject(err);
    }
    else {
      deferred.resolve({
        childProcess: childProcess,
        stdout: stdout,
        stderr: stderr
      });
    }
  });

  childProcess = cp.exec.apply(cp, args);
  process.nextTick(function () {
    deferred.notify(childProcess);
  });

  return deferred.promise;
}

module.exports = function (sassdoc) {
  sassdoc = sassdoc || require('./api');

  /**
   * Perform a sass to scss convertion and run SassDoc against the result.
   * @param  {String} src
   * @param  {String} dest
   * @param  {Object} config
   * @return {Q.Promise}
   */
  function documentize(src, dest, config) {
    var tmpDir = path.join(process.cwd(), '.tmp');
    var useBundler = false;
    var command = [
      'sass-convert',
      '-R',
      '--from=sass',
      '--to=scss',
      src,
      tmpDir
    ];

    if (useBundler) {
      command.unshift('bundle exec');
    }

    command = command.join(' ');

    return rmdir(tmpDir)
      .then(function () {
        return exec(command);
      })
      .then(function () {
        return sassdoc.documentize(tmpDir, dest, config);
      })
      .then(function () {
        return rmdir(tmpDir);
      })
      .catch(function (err) {
        console.error('ERROR: ', err);
      });
  }

  return {
    documentize: documentize
  };
};
