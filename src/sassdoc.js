let Q = require('q');
let mkdir = Q.denodeify(require('mkdirp'));
let path = require('path');
let safeWipe = require('safe-wipe');
let through = require('through2');
let vinyl = require('vinyl-fs');
let Logger = require('./logger').default;
let Parser = require('./parser').default;

export default function (src, dest, config) {
  let logger = config.logger || new Logger();

  return refresh(dest, {
    interactive: config.interactive || false,
    force: config.force || false,
    parent: src,
    silent: true,
  })

    .then(() => {
      logger.log(`Folder "${dest}" successfully refreshed.`);

      let parser = new Parser(config, config.theme.annotations);
      let [promise, stream] = parse(parser);

      read(src).pipe(stream);

      return promise;
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
      logger.error('stack' in err ? err.stack : err);
      throw err;
    });
}

export function refresh(dest, config) {
  return safeWipe(dest, config)
    .then(() => mkdir(dest));
}

export function read(src) {
  return vinyl.src(src);
}

export function parse(parser) {
  let data = [];
  let deferred = Q.defer();

  function transform(file, enc, cb) {
    if (file.isDirectory()) {
      let [promise, stream] = parse(parser);

      read(path.resolve(file.path, '**/*.scss')).pipe(stream);

      promise.then(data => {
        console.log(data);
        cb();
      });

      return;
    }

    let fileData = parser.parse(file.contents.toString(enc));

    // Add file metadata
    Object.keys(fileData).forEach(type => {
      fileData[type].forEach(item => {
        item.file = {
          path: file.relative,
          name: path.basename(file),
        };
      });
    });

    cb();
  }

  function flush(cb) {
    // End, data is full
    parser.postProcess(data);
    deferred.resolve(data);
    cb();
  }

  return [deferred.promise, through.obj(transform, flush)];
}
