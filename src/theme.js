let path = require('path');
import * as log from './logger';

// Forced to hook in `$traceurRuntine` to get original `resolve`
let resolve = $traceurRuntime.require.resolve;

/**
 * Return the actual theme function for given theme.
 *
 * If the theme is a path (understand, containing at least one `/`), it
 * will be resolved relatively to the given directory and required.
 *
 * Otherwise, it's required as a `sassdoc-theme-*` module, and in all
 * cases, if not found, the default theme is returned.
 */
export default function (theme, dir, logger = log.empty) {
  if (theme === undefined) {
    return def();
  }

  if (theme.indexOf('/') === -1) {
    return maybe(`sassdoc-theme-${theme}`, theme, logger);
  }

  return maybe(path.resolve(dir, theme), theme, logger);
}

/**
 * Try to require given module, and inspect the returned value.
 *
 * If not found, or the value is not valid, log a message using the
 * given friendly name, and fallback to default theme.
 */
function maybe(module, name, logger) {
  try {
    module = resolve(module);
  } catch (e) {
    logger.error(`Theme "${name}" not found.`);
    logger.warn('Falling back to default theme.');
    return def();
  }

  let theme = require(module);
  let str = Object.prototype.toString;

  if (typeof theme !== 'function') {
    logger.error(`Given theme is ${str(theme)}, expected ${str(maybe)}.`);
    return def();
  }

  if (theme.length !== 2) {
    logger.warn(`Given theme takes ${theme.length} arguments, expected 2.`);
  }

  return theme;
}

/**
 * Require default theme or throw an exception.
 */
function def() {
  let theme;

  try {
    theme = resolve('sassdoc-theme-default');
  } catch (e) {
    throw new Error('Holy shit, the default theme was not found!');
  }

  return require(theme);
}
