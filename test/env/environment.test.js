'use strict'

var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var assert = require('assert')
var sinon = require('sinon')
var rimraf = require('rimraf')
var mock = require('../mock')
var Environment = require('../../dist/environment')
var ensureEnvironment = require('../../').ensureEnvironment
var loggerModule = require('../../dist/logger')
var Logger = loggerModule.default
Logger.empty = loggerModule.empty

describe('#environment', function () {
  var warnings = []
  var logger
  var env

  beforeEach(function () {
    logger = new mock.Logger(true)
    env = new Environment(logger, false)
    warnings = logger.output
  })

  /**
   * Passed in config file.
   */
  describe('#config', function () {
    var configPath = path.join(__dirname, '../fixture/config.json')
    var configFile = require(configPath)

    beforeEach(function () {
      env.load(configPath)
      env.postProcess()
    })

    it('should properly process a passed in config file', function () {
      assert.ok(path.basename(env.file) === 'config.json')
      assert.deepEqual(env.display, configFile.display)
    })
  })

  /**
   * Passed in wrong type config file.
   */
  describe('#config-fail', function () {
    var spy

    beforeEach(function () {
      spy = sinon.spy()
      env.on('error', spy)
    })

    it('should error if config is a number', function () {
      env.load(123)
      assert.ok(spy.called)
    })

    it('should error if config is an array', function () {
      env.load([])
      assert.ok(spy.called)
    })
  })

  /**
   * Passed in undefined config file.
   */
  describe('#config-fail', function () {
    beforeEach(function () {
      env.load('fail.json')
      env.postProcess()
    })

    it('should warn if config file is not found', function () {
      assert.ok(path.basename(env.file) === '.sassdocrc')
      assert.notEqual(-1, warnings[0].indexOf('Config file `fail.json` not found'))
      assert.notEqual(-1, warnings[1].indexOf('Falling back to `.sassdocrc'))
    })
  })

  /**
   * Passed a config file with reserved keys.
   */
  describe('#config-fail', function () {
    var spy = sinon.spy()

    beforeEach(function () {
      env.on('error', spy)
      env.load({ fdomain: 'fail', strict: 'fail' }) // @TODO should not failt on 'strcit'
      env.postProcess()
    })

    it('should error if config contains reserved keys', function () {
      assert.ok(spy.called)
    })
  })

  /**
   * Default .sassdocrc process.
   */
  describe('#sassdocrc', function () {
    var sdrc

    var config = {
      display: {
        access: ['public', 'private'],
        alias: true,
        watermark: true
      }
    }

    beforeEach(function () {
      sdrc = new mock.SassDocRc(config)

      return sdrc.dump().then(function () {
        env.load()
        env.postProcess()
      })
    })

    it('should default to .sassdocrc', function () {
      assert.ok(warnings.length === 0)
      assert.ok(path.basename(env.file) === '.sassdocrc')
      assert.deepEqual(env.display, config.display)
    })

    after(function () {
      return sdrc.clean()
    })
  })

  /**
   * A config.package is passed but fails.
   */
  describe('#package-fail', function () {
    var spy = sinon.spy()

    beforeEach(function () {
      env.on('warning', spy)
      env.load({ package: 'should/fail.json' })
      env.postProcess()
    })

    it('should warn if package file is not found and load CWD package.json', function () {
      assert.ok(spy.called)
      assert.ok(env.package.name === 'sassdoc')
      assert.notEqual(-1, warnings[0].indexOf('should/fail.json` not found'))
      assert.notEqual(-1, warnings[1].indexOf('Falling back to `package.json`'))
    })
  })

  /**
   * Render default theme.
   */
  describe('#theme-default', function () {
    beforeEach(function () {
      env.load()
      env.postProcess()
      env.data = []
      mkdirp.sync('.sassdoc')
      return env.theme('.sassdoc', env)
    })

    it('should render the default theme', function () {
      assert.ok(env.themeName === 'default')
      assert.ok(fs.existsSync('.sassdoc/index.html'))
      assert.ok(fs.existsSync('.sassdoc/assets'))
    })

    after(function (done) {
      rimraf('.sassdoc', done)
    })
  })

  /**
   * A config.theme is passed but fails.
   */
  describe('#theme-fail', function () {
    beforeEach(function () {
      env.load({ theme: 'fail' })
      env.postProcess()
      env.data = []
      mkdirp.sync('.sassdoc')
      return env.theme('.sassdoc', env)
    })

    it('should warn and render the default theme', function () {
      assert.notEqual(-1, warnings[0].indexOf('Theme `fail` not found'))
      assert.notEqual(-1, warnings[1].indexOf('Falling back to default theme'))
      assert.ok(env.themeName === 'default')
      assert.ok(fs.existsSync('.sassdoc/index.html'))
      assert.ok(fs.existsSync('.sassdoc/assets'))
    })

    after(function (done) {
      rimraf('.sassdoc', done)
    })
  })

  /**
   * ensureEnvironment
   */
  describe('#ensureEnvironment', function () {
    it('should return a proper Environment instance', function () {
      env = ensureEnvironment({ testKey: 'just a test' })
      assert.ok(env instanceof Environment)
      assert.ok('testKey' in env)
    })

    it('should call passed callback on error', function () {
      var spy = sinon.spy()
      env = ensureEnvironment({ logger: Logger.empty }, spy)
      env.emit('error', new Error('Triggered from test'))
      assert.ok(spy.called)
    })

    it('should trow on error by default', function () {
      assert.throws(function () {
        env = ensureEnvironment({ logger: Logger.empty })
        env.emit('error', new Error('Triggered from test'))
      })
    })
  })

  /**
   * ensureLogger
   */
  describe('#ensureLogger', function () {
    it('should set a proper Logger instance for env', function () {
      env = ensureEnvironment({})
      assert.ok(env.logger instanceof Logger)
    })

    it('should trows if passed logger is not valid', function () {
      assert.throws(function () {
        ensureEnvironment({ logger: { fail: 'fail' } })
      })
    })

    it('should let a valid logger pass', function () {
      env = ensureEnvironment({ logger: Logger.empty })
      assert.ok(!(env.logger instanceof Logger))
    })
  })
})
