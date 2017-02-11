import { defer } from './utils'
import * as errors from './errors'
import AnnotationsApi from './annotation'
import sorter from './sorter'
import ScssCommentParser from 'scss-comment-parser'
import through from 'through2'
import concat from 'concat-stream'
import path from 'path'

export default class Parser {
  constructor (env, additionalAnnotations) {
    this.annotations = new AnnotationsApi(env)
    this.annotations.addAnnotations(additionalAnnotations)
    this.scssParser = new ScssCommentParser(this.annotations.list, env)

    this.scssParser.commentParser.on('warning', warning => {
      env.emit('warning', new errors.Warning(warning.message))
    })
  }

  parse (code, id) {
    return this.scssParser.parse(code, id)
  }

  /**
   * Invoke the `resolve` function of an annotation if present.
   * Called with all found annotations except with type "unkown".
   */
  postProcess (data) {
    data = sorter(data)

    Object.keys(this.annotations.list).forEach(key => {
      let annotation = this.annotations.list[key]

      if (annotation.resolve) {
        annotation.resolve(data)
      }
    })

    return data
  }

  /**
   * Return a transform stream meant to be piped in a stream of SCSS
   * files. Each file will be passed-through as-is, but they are all
   * parsed to generate a SassDoc data array.
   *
   * The returned stream has an additional `promise` property, containing
   * a `Promise` object that will be resolved when the stream is done and
   * the data is fulfiled.
   *
   * @param {Object} parser
   * @return {Object}
   */
  stream () {
    let deferred = defer()
    let data = []

    let transform = (file, enc, cb) => {
      // Pass-through.
      cb(null, file)

      let parseFile = ({ buf, name, path }) => {
        let fileData = this.parse(buf.toString(enc), name)

        fileData.forEach(item => {
          item.file = {
            path,
            name,
          }

          data.push(item)
        })
      }

      if (file.isBuffer()) {
        let args = {
          buf: file.contents,
          name: path.basename(file.relative),
          path: file.relative,
        }

        parseFile(args)
      }

      if (file.isStream()) {
        file.pipe(concat(buf => {
          parseFile({ buf })
        }))
      }
    }

    let flush = cb => {
      data = data.filter(item => item.context.type !== 'unknown')
      data = this.postProcess(data)

      deferred.resolve(data)
      cb()
    }

    let filter = through.obj(transform, flush)
    filter.promise = deferred.promise

    return filter
  }
}
