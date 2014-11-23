let utils = require('./utils');
let mkdir = utils.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let Logger = require('./logger').default;
// let Converter = require('./converter').default;
let Parser = require('./parser').default;
let sort = require('./sorter').default;
let stream = require('./stream');

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

      let recurse = stream.recurse();
      // let converter = new Converter(config).stream();

      let parser = new Parser(config, config.theme.annotations);
      let filter = parse(parser);

      stream.read(src)
        .pipe(recurse)
        // .pipe(converter)
        .pipe(filter)
        .on('error', err => {
          throw err;
        });

      return filter.promise;
    })

    .then(data => {
      logger.log(`Folder "${src}" successfully parsed.`);
      config.data = index(data);

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

export function parse(parser) {
  let filter = stream.default(parser);

  filter.promise = filter.promise.then(data => {
    data = data.filter(item => item.context.type !== 'unknown');
    data = parser.postProcess(data); // TODO: this is not flat yet
    data = sort(data);

    return data;
  });

  return filter;
}

export function index(data) {
  let obj = {};

  data.forEach(item => {
    if (!(item.context.type in obj)) {
      obj[item.context.type] = {};
    }

    obj[item.context.type][item.context.name] = item;
  });

  return obj;
}
