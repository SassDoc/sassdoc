let path = require('path');
let through = require('through2');
let utils = require('./utils');
let vinyl = require('vinyl-fs');

export default function stream(parser) {
  let data = [];
  let deferred = utils.defer();

  function transform(file, enc, cb) {
    if (file.isBuffer()) {
      // Synchronously merge data and pass to next chunk
      data = data.concat(parseFile(file, enc, parser));
      cb();
      return;
    }

    if (!file.isDirectory()) {
      // Don't know how to handle this object
      cb(new Error('Unsupported stream object.'));
    }

    parseDir(file, parser).then(subData => {
      // Merge data and pass to next chunk
      data = data.concat(subData);
      cb();
    }, err => {
      // Reject promise and cancel stream
      deferred.reject(err);
      cb(err);
    });
  }

  function flush(cb) {
    // End of stream, data is full
    deferred.resolve(data);
    cb();
  }

  let filter = through.obj(transform, flush);
  filter.promise = deferred.promise;
  return filter;
}

export function read(src) {
  return vinyl.src(src);
}

function parseDir(dir, parser) {
  /* global stream */
  let filter = stream(parser);
  read(path.resolve(dir.path, '**/*.scss')).pipe(filter);
  return filter.promise;
}

function parseFile(file, enc, parser) {
  let fileData = parser.parse(file.contents.toString(enc));
  let data = [];

  Object.keys(fileData).forEach(type => {
    fileData[type].forEach(item => {
      item.file = {
        path: file.relative,
        name: path.basename(file),
      };

      data.push(item);
    });
  });

  return data;
}
