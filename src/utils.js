const each = require('lodash.foreach');
const glob2base = require('glob2base');
const Glob = require('glob').Glob;

export function eachItem(byTypeAndName, cb) {
  each(byTypeAndName, function (typeObj) {
    each(typeObj, function (item) {
      cb(item);
    });
  });
}

// Namespace delimiters.
let nsDelimiters = ['::', ':', '\\.', '/'];
let ns = new RegExp(nsDelimiters.join('|'), 'g');

// Split a namespace on possible namespace delimiters.
export var splitNamespace = value => value.split(ns);

export function denodeify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...args) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(...args);
      });
    });
  };
}

export function defer() {
  /* jshint ignore:start */
  let resolve, reject;

  let promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });

  return {
    promise,
    resolve,
    reject,
  };
  /* jshint ignore:end */
}

/**
 * Get the base directory of given glob pattern (see `glob2base`).
 *
 * If it's an array, take the first one.
 *
 * @param {Array|String} src Glob pattern or array of glob patterns.
 * @return {String}
 */
export function g2b(src) {
  return glob2base(new Glob([].concat(src)[0]));
}

/**
 * Type checking helpers.
 */
const toString = arg => Object.prototype.toString.call(arg);

export const is = {
  undef: arg => arg === void 0,
  string: arg => typeof arg === 'string',
  function: arg => typeof arg === 'function',
  object: arg => typeof arg === 'object' && arg !== null,
  plainObject: arg => toString(arg) === '[object Object]',
  array: arg => Array.isArray(arg),
  error: arg => is.object(arg) &&
    (toString(arg) === '[object Error]' || arg instanceof Error),
  promise: arg => arg && is.function(arg.then),
  stream: arg => arg && is.function(arg.pipe),
};
