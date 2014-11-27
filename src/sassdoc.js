let utils = require('./utils');
let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let vfs = require('vinyl-fs');
let glob2base = require('glob2base');
let Glob = require('glob').Glob;
let cfg = require('./cfg');
let Logger = require('./logger').default;
let Parser = require('./parser').default;
let sort = require('./sorter').default;
let recurse = require('./recurse').default;
let exclude = require('./exclude').default;
let converter = require('sass-convert');

export default function sassdoc(src, dest, config = {}) {
  let logger = config.logger = config.logger || new Logger();
  config = cfg.post(config);

  return refresh(dest, {
    interactive: config.interactive || false,
    force: config.force || false,
    parent: g2b(src),
    silent: true,
  })

    .then(() => {
      logger.log(`Folder "${dest}" successfully refreshed.`);
      return parse(src, config);
    }, err => {
      // Friendly error for already existing directory
      throw new utils.SassDocError(err.message);
    })

    .then(data => {
      logger.log(`Folder "${src}" successfully parsed.`);
      config.data = data;

      let promise = config.theme(dest, config);

      if (promise && typeof promise.then === 'function') {
        return promise;
      }

      let type = Object.prototype.toString.call(promise);
      throw new Error(`Theme didn't return a promise, got ${type}.`);
    })

    .then(() => {
      if (config.themeName) {
        logger.log(`theme "${config.themeName}" successfully rendered.`);
      } else {
        logger.log('Anonymous theme successfully rendered.');
      }

      logger.log('Process over. Everything okay!');
    }, err => {
      if (err instanceof utils.SassDocError) {
        logger.error(err.message);
      } else {
        logger.error('stack' in err ? err.stack : err);
      }

      throw err;
    });
}

export function parse(src, config = {}) {
  config = cfg.post(config);

  let parser = new Parser(config, config.theme && config.theme.annotations);
  let parseFilter = parser.stream();

  vfs.src(src)
    .pipe(recurse())
    .pipe(exclude(config.exclude || []))
    .pipe(converter({ from: 'sass', to: 'scss', logger: config.logger }))
    .pipe(parseFilter);

  return parseFilter.promise.then(data => sort(data));
}

export function refresh(dest, config) {
  return safeWipe(dest, config)
    .then(() => mkdir(dest));
}

// Backward compability with v1.0 API.
/*global sassdoc: true */
export var documentize = sassdoc;

// Re-export, expose API.
export { Logger, Parser, sort, cfg };

/**
 * Get the base directory of given glob pattern (see `glob2base`).
 *
 * If it's an array, take the first one.
 *
 * @param {Array|String} src Glob pattern or array of glob patterns.
 * @return {String}
 */
function g2b(src) {
  return glob2base(new Glob([].concat(src)[0]));
}
