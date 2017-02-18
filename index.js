'use strict'

var sassdoc = require('./dist/sassdoc')

module.exports = sassdoc.default
module.exports.parseFilter = sassdoc.parseFilter
module.exports.ensureEnvironment = sassdoc.ensureEnvironment
module.exports.parse = sassdoc.parse
module.exports.Environment = sassdoc.Environment
module.exports.Logger = sassdoc.Logger
module.exports.Parser = sassdoc.Parser
module.exports.sorter = sassdoc.sorter
module.exports.errors = sassdoc.errors
