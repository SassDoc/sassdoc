import { denodeify, is, g2b } from './utils'

import Environment from './environment'
import Logger, { checkLogger } from './logger'
import Parser from './parser'
import * as errors from './errors'
import sorter from './sorter'
import exclude from './exclude'
import recurse from './recurse'

import fs from 'fs'
import path from 'path'
import difference from 'lodash.difference'
import safeWipe from 'safe-wipe'
import vfs from 'vinyl-fs'
import converter from 'sass-convert'
import pipe from 'multipipe'
import through from 'through2'
const mkdir = denodeify(require('mkdirp'))

/**
 * Expose lower API blocks.
 */
export { Environment, Logger, Parser, sorter, errors }

/**
 * Boostrap Parser and AnnotationsApi, execute parsing phase.
 * @return {Stream}
 * @return {Promise} - as a property of Stream.
 */
export function parseFilter (env = {}) {
  env = ensureEnvironment(env)

  let parser = new Parser(env, env.theme && env.theme.annotations)

  return parser.stream()
}

/**
 * Ensure a proper Environment Object and events.
 * @param {Object} config - can be falsy.
 * @return {Object}
 */
export function ensureEnvironment (config, onError = e => { throw e }) {
  if (config instanceof Environment) {
    config.on('error', onError)
    return config
  }

  let logger = ensureLogger(config)
  let env = new Environment(logger, config && config.strict)

  env.on('error', onError)
  env.load(config)
  env.postProcess()

  return env
}

/**
 * @param {Object} config
 * @return {Logger}
 */
function ensureLogger (config) {
  if (!is.object(config) || !('logger' in config)) {
    // Get default logger.
    return new Logger(config && config.verbose, process.env.SASSDOC_DEBUG)
  }

  let logger = checkLogger(config.logger)
  delete config.logger

  return logger
}

/**
 * Default public API method.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
export default function sassdoc (...args) {
  return srcEnv(documentize, stream)(...args)

  /**
   * Safely wipe and re-create the destination directory.
   * @return {Promise}
   */
  function refresh (env) {
    return safeWipe(env.dest, {
      force: true,
      parent: is.string(env.src) || is.array(env.src) ? g2b(env.src) : null,
      silent: true,
    })
      .then(() => mkdir(env.dest))
      .then(() => {
        env.logger.log(`Folder \`${env.displayDest}\` successfully refreshed.`)
      })
      .catch(err => {
        // Friendly error for already existing directory.
        throw new errors.SassDocError(err.message)
      })
  }

  /**
   * Render theme with parsed data context.
   * @return {Promise}
   */
  function theme (env) {
    let promise = env.theme(env.dest, env)

    if (!is.promise(promise)) {
      let type = Object.prototype.toString.call(promise)
      throw new errors.Error(`Theme didn't return a promise, got ${type}.`)
    }

    return promise
      .then(() => {
        let displayTheme = env.displayTheme || 'anonymous'
        env.logger.log(`Theme \`${displayTheme}\` successfully rendered.`)
      })
  }

  /**
   * Execute full SassDoc sequence from a source directory.
   * @return {Promise}
   */
  async function documentize (env) {
    init(env)
    let data = await baseDocumentize(env)

    try {
      await refresh(env)
      await theme(env)
      okay(env)
    } catch (err) {
      env.emit('error', err)
      throw err
    }

    return data
  }

  /**
   * Execute full SassDoc sequence from a Vinyl files stream.
   * @return {Stream}
   * @return {Promise} - as a property of Stream.
   */
  function stream (env) {
    let filter = parseFilter(env)

    filter.promise
      .then(data => {
        env.logger.log('Sass sources successfully parsed.')
        env.data = data
        onEmpty(data, env)
      })

    /**
     * Returned Promise await the full sequence,
     * instead of just the parsing step.
     */
    filter.promise = new Promise((resolve, reject) => {

      async function documentize () {
        try {
          init(env)
          await refresh(env)
          await theme(env)
          okay(env)
          resolve()
        } catch (err) {
          reject(err)
          env.emit('error', err)
          throw err
        }
      }

      filter
        .on('end', documentize)
        .on('error', err => env.emit('error', err))
        .resume() // Drain.

    })

    return filter
  }
}

/**
 * Parse and return data object.
 * @param {String | Array} src
 * @param {Object} env
 * @return {Promise | Stream}
 * @see srcEnv
 */
export function parse (...args) {

  return srcEnv(documentize, stream)(...args)

  /**
   * @return {Promise}
   */
  async function documentize (env) {
    let data = await baseDocumentize(env)

    return data
  }

  /**
   * Don't pass files through, but pass final data at the end.
   * @return {Stream}
   */
  function stream (env) {
    let parseStream = parseFilter(env)

    let filter = through.obj((file, enc, cb) => cb(), function (cb) {
      parseStream.promise.then(data => {
        this.push(data)
        cb()
      }, cb)
    })

    return pipe(parseStream, filter)
  }
}

/**
 * Source directory fetching and parsing.
 */
async function baseDocumentize (env) {
  let filter = parseFilter(env)

  filter.promise
    .then(data => {
      env.logger.log(`Folder \`${env.src}\` successfully parsed.`)
      env.data = data
      onEmpty(data, env)

      env.logger.debug(() => {
        fs.writeFile(
          'sassdoc-data.json',
          JSON.stringify(data, null, 2) + '\n'
        )

        return 'Dumping data to `sassdoc-data.json`.'
      })
    })

  let streams = [
    vfs.src(env.src),
    recurse(),
    exclude(env.exclude || []),
    converter({ from: 'sass', to: 'scss' }),
    filter
  ]

  let pipeline = () => {
    return new Promise((resolve, reject) => {
      pipe(...streams, err =>
        err ? reject(err) : resolve())
      .resume() // Drain.
    })
  }

  try {
    await pipeline()
  } catch (err) {
    env.emit('error', err)
    throw err
  }

  return env.data
}

/**
 * Return a function taking optional `src` string or array, and optional
 * `env` object (arguments are found by their type).
 *
 * If `src` is set, proxy to `documentize`, otherwise `stream`.
 *
 * Both functions will be passed the `env` object, which will have a
 * `src` key.
 */
function srcEnv (documentize, stream) {
  return function (...args) {
    let src = Array.find(args, a => is.string(a) || is.array(a))
    let env = Array.find(args, is.plainObject)

    env = ensureEnvironment(env)

    env.logger.debug('process.argv:', () => JSON.stringify(process.argv))
    env.logger.debug('sassdoc version:', () => require('../package.json').version)
    env.logger.debug('node version:', () => process.version.substr(1))

    env.logger.debug('npm version:', () => {
      let prefix = path.resolve(process.execPath, '../../lib')
      let pkg = path.resolve(prefix, 'node_modules/npm/package.json')

      try {
        return require(pkg).version
      } catch (e) {
        return 'unknown'
      }
    })

    env.logger.debug('platform:', () => process.platform)
    env.logger.debug('cwd:', () => process.cwd())

    env.src = src

    env.logger.debug('env:', () => {
      let clone = {}

      difference(
        Object.getOwnPropertyNames(env),
        ['domain', '_events', '_maxListeners', 'logger']
      )
        .forEach(k => clone[k] = env[k])

      return JSON.stringify(clone, null, 2)
    })

    let task = env.src ? documentize : stream
    env.logger.debug('task:', () => env.src ? 'documentize' : 'stream')

    return task(env)
  }
}

/**
 * Warn user on empty documentation.
 * @param {Array} data
 * @param {Object} env
 */
function onEmpty (data, env) {
  let message = `SassDoc could not find anything to document.\n
  * Are you still using \`/**\` comments ? They're no more supported since 2.0.
    See <http://sassdoc.com/upgrading/#c-style-comments>.
  * Are you documenting actual Sass items (variables, functions, mixins, placeholders) ?
    SassDoc doesn't support documenting CSS selectors.
    See <http://sassdoc.com/frequently-asked-questions/#does-sassdoc-support-css-classes-and-ids->.\n`

  if (!data.length) {
    env.emit('warning', new errors.Warning(message))
  }
}

/**
 * Init timer.
 * @param {Object} env
 */
function init (env) {
  env.logger.time('SassDoc')
}

/**
 * Log final success message.
 * @param {Object} env
 */
function okay (env) {
  env.logger.log('Process over. Everything okay!')
  env.logger.timeEnd('SassDoc', '%s completed after %dms')
}
