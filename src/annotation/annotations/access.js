export default function access(env) {

  const defaultPrivatePrefixTest = RegExp.prototype.test.bind(/^[_-]/);

  return {
    name: 'access',

    parse(text) {
      return text.trim();
    },

    autofill(item) {
      if (env.privatePrefix === false) { return; }

      let testFunc = defaultPrivatePrefixTest;

      if (typeof env.privatePrefix !== 'undefined') {
        testFunc = RegExp.prototype.test.bind(new RegExp(env.privatePrefix));
      }

      if (testFunc(item.context.name)) {
        return 'private';
      }

    },

    default() {
      return 'public';
    },

    multiple: false,
  };
}
