import { is } from './utils'
import * as errors from './errors'
import { format as fmt } from 'util'
import chalkModule from 'chalk'

const chalk = new chalkModule.constructor({
  enabled: process.stderr && process.stderr.isTTY,
})

// Special chars.
const chevron = '\xBB'
const checkmark = '\u2713'
const green = chalk.green(chevron)
const yellow = chalk.yellow(chevron)
const red = chalk.red(chevron)

export default class Logger {
  constructor (verbose = false, debug = false) {
    this.verbose = verbose
    this._stderr = process.stderr
    this._debug = debug
    this._times = []
  }

  /**
   * Log arguments into stderr if the verbose mode is enabled.
   */
  log (...args) {
    if (this.verbose) {
      let str = fmt(`${green} ${args.shift()}`, ...args)
      this._stderr.write(`${str}\n`)
    }
  }

  /**
   * Always log arguments as warning into stderr.
   */
  warn (...args) {
    let str = fmt(`${yellow} [WARNING] ${args.shift()}`, ...args)
    this._stderr.write(`${str}\n`)
  }

  /**
   * Always log arguments as error into stderr.
   */
  error (...args) {
    let str = fmt(`${red} [ERROR] ${args.shift()}`, ...args)
    this._stderr.write(`${str}\n`)
  }

  /**
   * Init a new timer.
   * @param {String} label
   */
  time (label) {
    this._times[label] = Date.now()
  }

  /**
   * End timer and log result into stderr.
   * @param {String} label
   * @param {String} format
   */
  timeEnd (label, format = '%s: %dms') {
    if (!this.verbose) {
      return
    }

    let time = this._times[label]
    if (!time) {
      throw new Error(`No such label: ${label}`)
    }

    let duration = Date.now() - time

    let str = fmt(`${chalk.green(checkmark)} ${format}`, label, duration)
    this._stderr.write(`${str}\n`)
  }

  /**
   * Log arguments into stderr if debug mode is enabled (will call all
   * argument functions to allow "lazy" arguments).
   */
  debug (...args) {
    if (!this._debug) {
      return
    }

    args = args.map(f => {
      if (f instanceof Function) {
        return f()
      }

      return f
    })

    let str = fmt(
      `${chalkModule.styles.grey.open}${chevron} [DEBUG] ${args.shift()}`,
      ...args,
      chalkModule.styles.grey.close
    )

    this._stderr.write(`${str}\n`)
  }
}

export var empty = {
  log: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
}

/**
 * Checks if given object looks like a logger.
 *
 * If the `debug` function is missing (like for the `console` object),
 * it will be set to an empty function in a newly returned object.
 *
 * If any other method is missing, an exception is thrown.
 *
 * @param {Object} logger
 * @return {Logger}
 * @throws {SassDocError}
 */
export function checkLogger (logger) {
  const methods = ['log', 'warn', 'error']
    .filter(x => !(x in logger) || !is.function(logger[x]))

  if (methods.length) {
    const missing = `"${methods.join('\`, \`')}"`
    const s = methods.length > 1 ? 's' : ''

    throw new errors.SassDocError(`Invalid logger, missing ${missing} method${s}`)
  }

  if ('debug' in logger) {
    return logger
  }

  return {
    log: logger.log,
    warn: logger.warn,
    error: logger.error,
    debug: empty.debug,
  }
}
