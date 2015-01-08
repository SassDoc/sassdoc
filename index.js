'use strict';

require('./bin/traceur-runtime');

var api = require('./dist/sassdoc');

module.exports = api.sassdoc;
module.exports.ensureEnvironment = api.ensureEnvironment;
module.exports.Environment = api.Environment;
module.exports.Logger = api.Logger;
module.exports.Parser = api.Parser;
module.exports.errors = api.errors;
