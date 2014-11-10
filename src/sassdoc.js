export function resolveConfig(path=null) {

}

export function refresh(dest) {

}

export function read(src) {

}

export function parse() {
  return require('through2').obj(function (file, enc, cb) {
    console.log('----', file.relative, '----');
    console.log();
    console.log(file.contents.toString(enc));

    cb();
  });
}

export function process(ctx) {

}

export function theme(dest, ctx) {

}
