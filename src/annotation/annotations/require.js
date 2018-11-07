import { splitNamespace } from '../../utils'
import uniq from 'lodash.uniq'

const reqRegEx = /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:-?\s*([^<$]*))?\s*(?:<?\s*(.*)\s*>)?$/

export default function require_ (env) {
  return {
    name: 'require',

    parse (text) {
      let match = reqRegEx.exec(text.trim())

      let obj = {
        type: match[1] || 'function',
        name: match[2],
      }

      obj.external = splitNamespace(obj.name).length > 1

      if (obj.name.indexOf('$') === 0) {
        obj.type = 'variable'
        obj.name = obj.name.slice(1)
      }

      if (obj.name.indexOf('%') === 0) {
        obj.type = 'placeholder'
        obj.name = obj.name.slice(1)
      }

      if (match[3]) {
        obj.description = match[3].trim()
      }

      if (match[4]) {
        obj.url = match[4]
      }

      return obj
    },

    autofill (item) {
      let type = item.context.type

      if (type === 'mixin' || type === 'placeholder' || type === 'function') {
        let handWritten

        if (item.require) {
          handWritten = {}

          item.require.forEach(reqObj => {
            handWritten[reqObj.type + '-' + reqObj.name] = true
          })
        }

        let mixins = searchForMatches(
          item.context.code,
          /@include\s+([^(;$]*)/ig,
          isAnnotatedByHand.bind(null, handWritten, 'mixin')
        )

        let functions = searchForMatches(
          item.context.code,
          new RegExp('(@include)?\\s*([a-z0-9_-]+)\\s*\\(', 'ig'), // Literal destroys Syntax
          isAnnotatedByHand.bind(null, handWritten, 'function'),
          2 // Get the second matching group instead of 1
        )

        let placeholders = searchForMatches(
          item.context.code,
          /@extend\s*%([^;\s]+)/ig,
          isAnnotatedByHand.bind(null, handWritten, 'placeholder')
        )

        let variables = searchForMatches(
          item.context.code,
          /\$([a-z0-9_-]+)/ig,
          isAnnotatedByHand.bind(null, handWritten, 'variable')
        )

        // Create object for each required item, removing duplicates
        mixins = mixins
          .filter(removeDuplicates)
          .map(typeNameObject('mixin'))
        functions = functions
          .filter(removeDuplicates)
          .map(typeNameObject('function'))
        placeholders = placeholders
          .filter(removeDuplicates)
          .map(typeNameObject('placeholder'))
        variables = variables
          .filter(removeDuplicates)
          .map(typeNameObject("variable"));

        // Merge all arrays.
        let all = [].concat(mixins, functions, placeholders, variables)

        // Merge in user supplied requires if there are any.
        if (item.require && item.require.length > 0) {
          all = all.concat(item.require)
        }

        // Filter empty values.
        all = all.filter((elem) => {
          return elem !== undefined
        })

        if (all.length > 0) {
          all = uniq(all, 'name')

          // Filter the item itself.
          all = all.filter(x => {
            return !(x.name === item.context.name && x.type === item.context.type)
          })

          return all
        }
      }
    },

    resolve (data) {
      data.forEach(item => {
        if (item.require === undefined) {
          return
        }

        item.require = item.require.map(req => {
          if (req.external === true) {
            return req
          }

          let reqItem = Array.find(data, x => x.context.name === req.name && x.context.type === req.type)

          if (reqItem === undefined) {
            if (!req.autofill) {
              env.logger.warn(
                `Item \`${item.context.name}\` requires \`${req.name}\` from type \`${req.type}\` but this item doesn't exist.`
              )
            }

            return
          }

          if (!Array.isArray(reqItem.usedBy)) {
            reqItem.usedBy = []

            reqItem.usedBy.toJSON = function () {
              return reqItem.usedBy.map(item => {
                return {
                  description: item.description,
                  context: item.context,
                }
              })
            }
          }

          if (reqItem.usedBy.indexOf(item) === -1) {
            reqItem.usedBy.push(item)
          }
          req.item = reqItem

          return req
        })
          .filter(x => x !== undefined)

        if (item.require.length > 0) {
          item.require.toJSON = function () {
            return item.require.map(item => {
              let obj = {
                type: item.type,
                name: item.name,
                external: item.external,
              }

              if (item.external) {
                obj.url = item.url
              } else {
                obj.description = item.description
                obj.context = item.context
              }

              return obj
            })
          }
        }
      })
    },

    alias: ['requires'],
  }
}

function isAnnotatedByHand (handWritten, type, name) {
  if (type && name && handWritten) {
    return handWritten[type + '-' + name]
  }

  return false
}

function searchForMatches (code, regex, isAnnotatedByHandProxy, id = 1) {
  let match
  let matches = []

  while ((match = regex.exec(code))) {
    if (!isAnnotatedByHandProxy(match[id]) && (id <= 1 || match[id-1] === undefined)) {
      matches.push(match[id])
    }
  }

  return matches
}

function typeNameObject (type) {
  return function (name) {
    if (name.length > 0) {
      return {
        type: type,
        name: name,
        autofill: true,
      }
    }
  }
}

function removeDuplicates (elem, pos, arr) {
  return arr.indexOf(elem) === pos
}
