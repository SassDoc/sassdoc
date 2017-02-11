'use strict'

var path = require('path')
var fs = require('fs')
var inherits = require('util').inherits
var Writable = require('stream').Writable
var Logger = require('../').Logger
var utils = require('../dist/utils')
var writeFile = utils.denodeify(fs.writeFile)
var unlink = utils.denodeify(fs.unlink)
var is = utils.is

function SassDocRc (config) {
  this._filePath = path.join(process.cwd(), '.sassdocrc')
  this._contents = config || {}
}

SassDocRc.prototype.dump = function () {
  return writeFile(this._filePath, JSON.stringify(this._contents))
}

SassDocRc.prototype.clean = function () {
  return unlink(this._filePath)
}

Object.defineProperty(SassDocRc.prototype, 'contents', {
  get: function () {
    return this._contents
  },
  set: function (config) {
    if (!is.plainObject(config)) {
      throw new Error('SassDocRc.contents can only be an Object.')
    }
    this._contents = config
  }
})

module.exports.SassDocRc = SassDocRc

function MockLogger () {
  Logger.call(this, arguments)
  this._output = []
  this._stderr = new Writable()
  this._stderr._write = function (chunk, enc, cb) {
    this._output.push(chunk.toString())
    cb()
  }.bind(this)
}

inherits(MockLogger, Logger)

Object.defineProperty(MockLogger.prototype, 'output', {
  get: function () {
    return this._output
  }
})

module.exports.Logger = MockLogger
