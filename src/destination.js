'use strict';

var fs = require('fs');
var path = require('path');
var readline = require('readline');
var Q = require('q');

/**
 * Prompt user with a question and listen to reply.
 *
 * @see    {@link http://nodejs.org/api/readline.html}
 * @param  {String} question
 * @return {Q.Promise}
 */
function prompt(question) {
  var deferred = Q.defer();

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(question, function (answer) {
    rl.close();
    deferred.resolve(answer);
  });

  return deferred.promise;
}

/**
 * Check whether dest is a parent of src, or identical.
 *
 * @param  {String} src
 * @param  {String} dest
 * @return {Boolean}
 */
function isParent(src, dest) {
  return path.resolve(src).indexOf(path.resolve(dest)) === 0;
}

/**
 * Check whether passed directory is empty or does not exist.
 *
 * @param  {String} dest
 * @return {Q.Promise}
 */
function isEmpty(dest) {
  return Q.nfcall(fs.readdir, dest)
    .then(function (files) {
      return files.filter(function (file) {
        return ['.DS_Store', 'Thumbs.db'].indexOf(file) === -1;
      });
    })
    .then(function (files) {
      return !files || !files.length;
    })
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        return true;
      }
      else {
        throw err;
      }
    });
}

exports = module.exports = {

  /**
   * Check tree relation between src and dest.
   *
   * @param  {String} src
   * @param  {String} dest
   * @return {Q.Promise}
   */
  checkTree: function (src, dest) {
    var deferred = Q.defer();

    if (isParent(src, dest)) {
      deferred.reject(new Error(
        'Source folder seems to be contained by destination folder.' + '\n' +
        'Let\'s not wipe everything out.'
      ));
    }
    else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  /**
   * Check whether SassDoc can securely wip destination folder.
   *
   * @param  {String} dest
   * @return {Q.Promise}
   */
  checkDest: function (dest) {
    var question = '[?] Destination folder will be wiped out. ' +
                   'Are you sure you want to proceed: [y/N] ';
    var deferred = Q.defer();

    isEmpty(dest)
      .then(function (empty) {
        if (!empty) {
          prompt(question)
            .then(function (answer) {
              var proceed = /^y(es)?/i.test(answer);

              if (!proceed) {
                deferred.reject(new Error(
                  'Destination folder not empty, aborting'
                ));
              }
              else {
                deferred.resolve();
              }
            });
        }
        else {
          deferred.resolve();
        }
      });

    return deferred.promise;
  },

  /**
   * Performs checks on destination folder before securely wiping it.
   *
   * @param  {Object} options
   * @return {Q.Promise}
   */
  check: function (options) {
    var src = options['<src>'];
    var dest = options['<dest>'];
    var promises = [];

    promises.push(exports.checkTree(src, dest));

    if (!options['--no-prompt']) {
      promises.push(exports.checkDest(dest));
    }

    return Q.all(promises);
  }

};
