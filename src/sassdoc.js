let utils = require('./utils');
let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let vfs = require('vinyl-fs');
let Logger = require('./logger').default;
let Converter = require('./converter').default;
let Parser = require('./parser').default;
let sort = require('./sorter').default;
let recurse = require('./recurse').default;

export default function sassdoc(src, dest, config) {
  let logger = config.logger || new Logger();

  return refresh(dest, {
    interactive: config.interactive || false,
    force: config.force || false,
    parent: src,
    silent: true,
  })

    .then(() => {
      logger.log(`Folder "${dest}" successfully refreshed.`);

      let converter = Converter(config);
      let parser = new Parser(config, config.theme.annotations);
      let parseFilter = parser.stream();

      vfs.src(src)
        .pipe(recurse())
        .pipe(converter)
        .pipe(parseFilter);

      return parseFilter.promise;
    })

    .then(data => {
      logger.log(`Folder "${src}" successfully parsed.`);
      config.data = sort(data);

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
      logger.error('stack' in err ? err.stack : err);
      throw err;
    });
}

export function refresh(dest, config) {
  return safeWipe(dest, config)
    .then(() => mkdir(dest));
}

// Backward compability with v1.0 API.
export var documentize = sassdoc;

// Re-export, expose API.
export { Logger, Converter, Parser, sort };
export { default as cfg } from './cfg';
