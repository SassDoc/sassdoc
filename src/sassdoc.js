let Q = require('q');
let mkdir = Q.denodeify(require('mkdirp'));
let safeWipe = require('safe-wipe');
let through = require('through2');
let vinyl = require('vinyl-fs');
import log from './log';

export default function (src, dest, config) {
  let logger = config.logger || log();

  return refresh(dest, {
    interactive: config.interactive || false,
    force: config.force || false,
    parent: src,
    silent: true,
  })

    .then(() => {
      logger.log(`Folder \`${dest}\` successfully refreshed.`);

      let parser = new Parser(config, config.theme.annotations);
      let [promise, stream] = parse(parser);

      read(src).pipe(stream);

      return promise;
    })

    .then(data => {
      logger.log(`Folder \`${src}\` successfully parsed.`);
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
        logger.log(`theme \`${config.themeName}\` successfully rendered.`);
      } else {
        logger.log('Anonymous theme successfully rendered.');
      }

      logger.log('Process over. Everything okay!');
    }, err => {
      logger.error('stack' in err ? err.stack : err);
      throw err;
    });
};

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
    // TODO: what if `file` is a directory?

    let fileData = parser.parse(file.contents.toString(enc))

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

  return [deferred, through.obj(transform, flush)];
}

import cli from './cli';
export { cli };

import cfg from './cfg';
export { cfg };
