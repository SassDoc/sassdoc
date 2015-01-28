'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var sinon = require('sinon');
var rimraf = require('rimraf');
var mock = require('../mock');
var Environment = require('../../dist/environment');

describe('#environment', function () {
  var warnings = [];
  var logger;
  var env;

  beforeEach(function () {
    logger = new mock.Logger(true);
    env = new Environment(logger, false);
    warnings = logger.output;
  });

  /**
   * Passed in config file.
   */
  describe('#config', function () {
    var configPath = path.join(__dirname, '../fixture/config.json');
    var configFile = require(configPath);

    beforeEach(function () {
      env.load(configPath);
      env.postProcess();
    });

    it('should properly process a passed in config file', function () {
      assert.ok(path.basename(env.file) === 'config.json');
      assert.deepEqual(env.display, configFile.display);
    });
  });

  /**
   * Passed in wrong type config file.
   */
  describe('#config-fail', function () {
    var spy = sinon.spy();

    beforeEach(function () {
      env.on('error', spy);
      env.load(123); // @TOO [] pass
      env.postProcess();
    });

    it('should error if config is of a wrong format', function () {
      assert.ok(spy.called);
    });
  });

  /**
   * Passed in undefined config file.
   */
  describe('#config-fail', function () {
    beforeEach(function () {
      env.load('fail.json');
      env.postProcess();
    });

    it('should warn if config file is not found', function () {
      assert.ok(path.basename(env.file) === '.sassdocrc');
      assert.ok(warnings[0].includes('Config file `fail.json` not found'));
      assert.ok(warnings[1].includes('Falling back to `.sassdocrc'));
    });
  });

  /**
   * Default .sassdocrc process.
   */
  describe('#sassdocrc', function () {
    var sdrc;

    var config = {
      display: {
        access: ['public', 'private'],
        alias: true,
        watermark: true
      }
    };

    beforeEach(function () {
      sdrc = new mock.SassDocRc(config);

      return sdrc.dump().then(function () {
        env.load();
        env.postProcess();
      });
    });

    it('should default to .sassdocrc', function () {
      assert.ok(warnings.length === 0);
      assert.ok(path.basename(env.file) === '.sassdocrc');
      assert.deepEqual(env.display, config.display);
    });

    after(function () {
      return sdrc.clean();
    });
  });

  /**
   * A config.package is passed but fails.
   */
  describe('#package-fail', function () {
    var spy = sinon.spy();

    beforeEach(function () {
      env.on('warning', spy);
      env.load({ package: 'should/fail.json' });
      env.postProcess();
    });

    it('should warn if package file is not found and load CWD package.json', function () {
      assert.ok(spy.called);
      assert.ok(env.package.name === 'sassdoc');
      assert.ok(warnings[0].includes('should/fail.json` not found'));
      assert.ok(warnings[1].includes('Falling back to `package.json`'));
    });
  });

  /**
   * Render default theme.
   */
  describe('#theme-default', function () {
    beforeEach(function () {
      env.load();
      env.postProcess();
      env.data = [];
      return env.theme('.sassdoc', env);
    });

    it('should render the default theme', function () {
      assert.ok(env.themeName === 'default');
      assert.ok(fs.existsSync('.sassdoc/index.html'));
      assert.ok(fs.existsSync('.sassdoc/assets'));
    });

    after(function (done) {
      rimraf('.sassdoc', done);
    });
  });

  /**
   * A config.theme is passed but fails.
   */
  describe('#theme-fail', function () {
    beforeEach(function () {
      env.load({ theme: 'fail' });
      env.postProcess();
      env.data = [];
      return env.theme('.sassdoc', env);
    });

    it('should warn and render the default theme', function () {
      assert.ok(warnings[0].includes('Theme `fail` not found'));
      assert.ok(warnings[1].includes('Falling back to default theme'));
      // assert.ok(env.themeName === 'default'); // @TODO ??
      assert.ok(fs.existsSync('.sassdoc/index.html'));
      assert.ok(fs.existsSync('.sassdoc/assets'));
    });

    after(function (done) {
      rimraf('.sassdoc', done);
    });
  });

});
