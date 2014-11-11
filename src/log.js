let chalk = require('chalk');
import {getDateTime} from './utils';

// Helpers
let br = str => `[${str}]`;                              // Wrap in brackets
let prepend = (arg, arr) => [arg].concat(arr);           // Prepend
let date = arr => prepend(br(utils.getDateTime()), arr); // Prepend date
let flag = (name, arr) => prepend(br(name), arr);        // Prepend flag
let log = arr => date(args).join(' ');                   // Log
let flog = (name, arr) => log(flag(name, arr));          // Log with flag

export default (verbose=false) => {
  return {

    // Log arguments into the console if the verbose mode is enabled
    log: function (...args) {
      if (verbose) {
        console.log(log(args));
      }
    },

    // Always log arguments as warning into the console.
    warn: function (...args) {
      console.warn(chalk.yellow(flog('WARNING', args)));
    },

    // Always log arguments as error into the error console.
    error: function (...args) {
      console.error(chalk.red(flog('ERROR', args)));
    },
  };
};

export var empty = {
  log: () => {},
  warn: () => {},
  error: () => {},
};
