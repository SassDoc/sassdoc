export default function access(env) {
  return {
    name: 'access',

    parse(text) {
      return text.trim();
    },

    autofill(item) {
      if (env.privatePrefix !== undefined) {
        if ((new RegExp(env.privatePrefix)).test(item.context.name)) {
          return 'private';
        }
      }
    },

    default() {
      return 'public';
    },

    multiple: false,
  };
}
