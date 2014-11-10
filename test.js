var vinyl = require('vinyl-fs');
var sassdoc = require('./index');

vinyl.src('./src/**/*.js')
  .pipe(sassdoc.parse());
