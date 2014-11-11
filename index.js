'use strict';

/**
 * Require Traceur transpiler, that will declare the `$traceurRuntine`
 * environment variable needed by `index.traceur.js` required below.
 *
 * Make Traceur require function the default, but allow to load CommonJS
 * modules from `node_modules` without transpiling.
 *
 * This setup allows to bring a CommonJS interface to ES6 SassDoc module,
 * and let SassDoc internal code use `require` for external modules.
 */
require('traceur').require.makeDefault(function (filename) {
  return filename.indexOf('node_modules') === -1;
});

$traceurRuntime.require.resolve = require.resolve;

//module.exports = require('./bundle');
module.exports = require('./src/sassdoc');
