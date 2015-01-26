'use strict';

var assert = require('assert');
var jsesc = require('jsesc');
var Logger = require('../../dist/logger');

function log(str) {
  return '\u001b[32m\xBB\u001b[39m ' + str + '\n';
}
function warn(str) {
  return '\u001b[33m\xBB\u001b[39m [WARNING] ' + str + '\n';
}
function error(str) {
  return '\u001b[31m\xBB\u001b[39m [ERROR] ' + str + '\n';
}
function debug(str) {
  return '\u001b[90m\xBB [DEBUG] ' + str + ' \u001b[39m\n';
}

describe('#logger', function () {
  var logger;
  var stderrWrite;
  var strings = [];

  before(function () {
    assert.ok(process.stdout.writable);
    assert.ok(process.stderr.writable);

    logger = new Logger(true, true);

    stderrWrite = global.process.stderr.write;

    global.process.stderr.write = function (string) {
      strings.push(string);
    };

    // test logger.log()
    logger.log('foo');
    logger.log('foo', 'bar');
    logger.log('%s %s', 'foo', 'bar', 'hop');

    // test logger.warn()
    logger.warn('foo');
    logger.warn('foo', 'bar');
    logger.warn('%s %s', 'foo', 'bar', 'hop');

    // test logger.error()
    logger.error('foo');
    logger.error('foo', 'bar');
    logger.error('%s %s', 'foo', 'bar', 'hop');

    // test logger.debug()
    logger.debug('foo');
    logger.debug('foo', 'bar');
    logger.debug('%s %s', 'foo', 'bar', 'hop');

    // test logger.timeEnd()
    logger.time('label');
    logger.timeEnd('label');
    logger.time('task');
    logger.timeEnd('task', 'Custom %s completed in %dms');
  });

  it('should properly `log` with a green chevron', function () {
    assert.equal(log('foo'), strings.shift());
    assert.equal(log('foo bar'), strings.shift());
    assert.equal(log('foo bar hop'), strings.shift());
  });

  it('should properly `warn` with a yellow chevron', function () {
    assert.equal(warn('foo'), strings.shift());
    assert.equal(warn('foo bar'), strings.shift());
    assert.equal(warn('foo bar hop'), strings.shift());
  });

  it('should properly `error` with a red chevron', function () {
    assert.equal(error('foo'), strings.shift());
    assert.equal(error('foo bar'), strings.shift());
    assert.equal(error('foo bar hop'), strings.shift());
  });

  it('should properly `debug` with a grey chevron', function () {
    assert.equal(debug('foo'), strings.shift());
    assert.equal(debug('foo bar'), strings.shift());
    assert.equal(debug('foo bar hop'), strings.shift());
  });

  it('should properly `timeEnd` with default message', function () {
    var re = /\\x1B\[32m\\u2713\\x1B\[39m label: \d+ms\\n/;
    var escStr = jsesc(strings.shift());
    assert.ok(re.test(escStr));
  });

  it('should properly `timeEnd` with custom message', function () {
    var re = /\\x1B\[32m\\u2713\\x1B\[39m Custom task completed in \d+ms\\n/;
    var escStr = jsesc(strings.shift());
    assert.ok(re.test(escStr));
  });

  it('should throw if `label` is not defined', function () {
    assert.throws(function () {
      logger.timeEnd('no such label');
    });
  });

  it('should not throw if `label` is defined', function () {
    assert.doesNotThrow(function () {
      logger.time('token');
      logger.timeEnd('token');
    });
  });

  after(function () {
    global.process.stderr.write = stderrWrite;
  });
});
