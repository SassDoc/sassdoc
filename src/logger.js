import { is } from './utils';
import * as errors from './errors';

const fmt = require('util').format;
const chalk = require('chalk');

// Special chars.
const chevron = '\xBB';
const checkmark = '\u2713';
const green = chalk.green(chevron);
const yellow = chalk.yellow(chevron);
const red = chalk.red(chevron);

// Helpers.
const br = str => `[${str}]`; // Wrap in brackets.

export default class Logger {
  constructor(verbose = false, debug = false) {
    this.verbose = verbose;
    this._stdout = process.stdout;
    this._stderr = process.stderr;
    this._debug = debug;
    this._times = [];
  }

  /**
   * Log arguments into stderr if the verbose mode is enabled.
   */
  log(...args) {
    if (this.verbose) {
      let str = fmt(`${green} ${args.shift()}`, ...args);
      this._stderr.write(`${str}\n`);
    }
  }

  /**
   * Always log arguments as warning into stderr.
   */
  warn(...args) {
    chalkHack(() => {
      let str = fmt(`${yellow} ${br('WARNING')} ${args.shift()}`, ...args);
      this._stderr.write(`${str}\n`);
    });
  }

  /**
   * Always log arguments as error into stderr.
   */
  error(...args) {
    chalkHack(() => {
      let str = fmt(`${red} ${br('ERROR')} ${args.shift()}`, ...args);
      this._stderr.write(`${str}\n`);
    });
  }

  /**
   * Init a new timer.
   * @param {String} label
   */
  time(label) {
    this._times[label] = Date.now();
  }

  /**
   * End timer and log result into stderr.
   * @param {String} label
   * @param {String} format
   */
  timeEnd(label, format = '%s: %dms') {
    if (!this.verbose) {
      return;
    }

    let time = this._times[label];
    if (!time) {
      throw new Error(`No such label: ${label}`);
    }

    let duration = Date.now() - time;

    let str = fmt(`${chalk.green(checkmark)} ${format}`, label, duration);
    this._stderr.write(`${str}\n`);
  }

  /**
   * Log arguments into stderr if debug mode is enabled (will call all
   * argument functions to allow "lazy" arguments).
   */
  debug(...args) {
    if (!this._debug) {
      return;
    }

    args = args.map(f => {
      if (f instanceof Function) {
        return f();
      }

      return f;
    });

    chalkHack(() => {
      let str = fmt(
        `${chalk.styles.grey.open}${chevron} ${br('DEBUG')} ${args.shift()}`,
        ...args,
        chalk.styles.grey.close
      );

      this._stderr.write(`${str}\n`);
    });
  }
}

export var empty = {
  log: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
};

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
export function checkLogger(logger) {
  const methods = ['log', 'warn', 'error']
    .filter(x => !(x in logger) || !is.function(logger[x]));

  if (methods.length) {
    const missing = `"${methods.join('\`, \`')}"`;
    const s = methods.length > 1 ? 's' : '';

    throw new errors.SassDocError(`Invalid logger, missing ${missing} method${s}`);
  }

  if ('debug' in logger) {
    return logger;
  }

  return {
    log: logger.log,
    warn: logger.warn,
    error: logger.error,
    debug: empty.debug,
  };
}

/**
 * Chalk don't allow us to create a new instance with our own `enabled`
 * value (internal functions always reference the global export). Here
 * we want to enable it if stderr is a TTY, but it's not acceptable to
 * modify the global context for this purpose.
 *
 * So this hack will set `chalk.enabled` for the time of the synchronous
 * callback execution, then reset it to whatever was its default value.
 */
function chalkHack(cb) {
  let enabled = chalk.enabled;
  chalk.enabled = process.stderr.isTTY;
  cb();
  chalk.enabled = enabled;
}
