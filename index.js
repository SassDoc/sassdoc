'use strict';

require('../polyfill');

var api = require('./dist/sassdoc');

module.exports = api.default;
module.exports.parse = api.parse;
module.exports.ensureEnvironment = api.ensureEnvironment;
module.exports.Environment = api.Environment;
module.exports.Logger = api.Logger;
module.exports.Parser = api.Parser;
module.exports.errors = api.errors;
