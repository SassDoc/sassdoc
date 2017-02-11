export default function access (env) {

  const defaultPrivatePrefixTest = RegExp.prototype.test.bind(/^[_-]/)

  return {
    name: 'access',

    parse (text) {
      return text.trim()
    },

    autofill (item) {
      if (item.access !== 'auto') {
        return
      }

      if (env.privatePrefix === false) {
        return
      }

      let testFunc = defaultPrivatePrefixTest

      if (typeof env.privatePrefix !== 'undefined') {
        testFunc = RegExp.prototype.test.bind(new RegExp(env.privatePrefix))
      }

      if (testFunc(item.context.name)) {
        return 'private'
      }

      return 'public'
    },

    resolve (data) {
      data.forEach(item => {
        // Ensure valid access when not autofilled.
        if (item.access === 'auto') {
          item.access = 'public'
        }
      })
    },

    default () {
      return 'auto'
    },

    multiple: false,
  }
}
