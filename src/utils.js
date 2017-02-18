import glob2base from 'glob2base'
import { Glob } from 'glob'

// Namespace delimiters.
const nsDelimiters = ['::', ':', '\\.', '/']
const ns = new RegExp(nsDelimiters.join('|'), 'g')

// Split a namespace on possible namespace delimiters.
export const splitNamespace = value => value.split(ns)

export function denodeify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...args) => {
        if (err) {
          reject(err)
          return
        }

        resolve(...args)
      })
    })
  }
}

export function defer () {
  let resolve, reject

  let promise = new Promise((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  return {
    promise,
    resolve,
    reject,
  }
}

/**
 * Get the base directory of given glob pattern (see `glob2base`).
 *
 * If it's an array, take the first one.
 *
 * @param {Array|String} src Glob pattern or array of glob patterns.
 * @return {String}
 */
export function g2b (src) {
  return glob2base(new Glob([].concat(src)[0]))
}

/**
 * Type checking helpers.
 */
const toString = arg => Object.prototype.toString.call(arg)

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
  vinylFile: arg => is.plainObject(arg) && arg.constructor.name === 'File',
}
