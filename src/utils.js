let path = require('path');
let _ = require('lodash');

export function eachItem(byTypeAndName, cb) {
  _.each(byTypeAndName, function (typeObj) {
    _.each(typeObj, function (item) {
      cb(item);
    });
  });
}

// Get file extension.
export var ext = file => path.extname(file).substr(1);

/**
 * Get current date/time.
 *
 * @param {Date} date
 * @return {String} Stringified date time.
 */
export function getDateTime(date = new Date()) {
  let y, m, d, h, i, s;

  y = date.getFullYear();
  m = exports.pad(date.getMonth() + 1);
  d = exports.pad(date.getDate());
  h = exports.pad(date.getHours());
  i = exports.pad(date.getMinutes());
  s = exports.pad(date.getSeconds());

  return `${y}-${m}-${d} ${h}:${i}:${s}`;
}

// Pad a number with a leading 0 if inferior to 10.
export var pad = value => (value < 10 ? '0' : '') + value;

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
}

export class SassDocError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
