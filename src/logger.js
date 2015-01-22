const { is } = require('./utils');
const errors = require('./errors');
const chalk = require('chalk');
const dateformat = require('dateformat');

// Helpers.
let br = str => `[${str}]`;                          // Wrap in brackets.
let time = () => dateformat(new Date(), 'HH:MM:ss'); // Format time.
let prepend = (arg, arr) => [arg].concat(arr);       // Prepend.
let date = arr => prepend(br(time()), arr);          // Prepend date.
let flag = (name, arr) => prepend(br(name), arr);    // Prepend flag.
let log = arr => date(arr).join(' ');                // Log.
let flog = (name, arr) => log(flag(name, arr));      // Log with flag.

export default class Logger {
  constructor(verbose = false, debug = false) {
    this.verbose = verbose;
    this.debug_ = debug;
  }

  /**
   * Log arguments into stderr if the verbose mode is enabled.
   */
  log(...args) {
    if (this.verbose) {
      console.error(log(args));
    }
  }

  /**
   * Always log arguments as warning into stderr.
   */
  warn(...args) {
    chalkHack(() => console.error(chalk.yellow(flog('WARNING', args))));
  }

  /**
   * Always log arguments as error into stderr.
   */
  error(...args) {
    chalkHack(() => console.error(chalk.red(flog('ERROR', args))));
  }

  /**
   * Log arguments into stderr if debug mode is enabled (will call all
   * argument functions to allow "lazy" arguments).
   */
  debug(...args) {
    if (this.debug_) {
      chalkHack(() => {
        console.error(chalk.grey(flog('DEBUG', args.map(f => {
          if (f instanceof Function) {
            return f();
          }

          return f;
        }))));
      });
    }
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
    const missing = `"${methods.join('", "')}"`;
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
