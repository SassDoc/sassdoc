let doc = `
Usage: sassdoc <src> [options]

Arguments:
  <src>   Path to your Sass folder.

Options:
  -h, --help            Bring help.
  --version             Show version.
  -v, --verbose         Enable verbose mode.
  -d, --dest=<dir>      Documentation folder [default: sassdoc].
  -c, --config=<path>   Path to JSON/YAML configuration file.
  -t, --theme=<name>    Theme to use.
  --no-update-notifier  Disable update notifier check.
  --strict              Turn warnings into errors.
`;

let docopt = require('docopt').docopt;
let pkg = require('../package.json');
let Environment = require('./environment').default;
let Logger = require('./logger').default;
let sassdoc = require('./sassdoc').default;
let errors = require('./errors');

export default function cli(argv = process.argv) {
  let options = docopt(doc, { version: pkg.version, argv: argv });
  let logger = new Logger(options['--verbose']);
  let env = new Environment(logger, options['--strict']);

  env.on('error', error => {
    if (error instanceof errors.Warning) {
      process.exit(2);
    }

    process.exit(1);
  });

  env.load(options['--config']);

  // Ensure CLI options.
  ensure(env, options, {
    dest: '--dest',
    theme: '--theme',
    noUpdateNotifier: '--no-update-notifier',
  });

  env.postProcess();

  // Run update notifier if not explicitely disabled.
  if (!env.noUpdateNotifier) {
    require('./notifier').default(pkg, logger);
  }

  sassdoc(options['<src>'], env);
}

/**
 * Ensure that CLI options take precedence over configuration values.
 *
 * For each name/option tuple, if the option is set, override configuration
 * value.
 */
function ensure(env, options, names) {
  for (let k of Object.keys(names)) {
    let v = names[k];

    if (options[v]) {
      env[k] = options[v];
    }
  }
}
