let doc = `
Usage:
  sassdoc - [options]
  sassdoc <src>... [options]
  sassdoc [options]

Arguments:
  <src>  Path to your Sass folder.

Options:
  -h, --help            Bring help.
  --version             Show version.
  -v, --verbose         Enable verbose mode.
  -d, --dest=<dir>      Documentation folder [default: sassdoc].
  -c, --config=<path>   Path to JSON/YAML configuration file.
  -t, --theme=<name>    Theme to use.
  -p, --parse           Parse the input and output JSON data to stdout.
  --no-update-notifier  Disable update notifier check.
  --strict              Turn warnings into errors.
  --debug               Output debugging information.
`;

import Environment from './environment';
import Logger from './logger';
// Nicer but JSHint no like
// import sassdoc, { parse } from './sassdoc';
import { default as sassdoc, parse } from './sassdoc';
import * as errors from './errors';

const docopt = require('docopt').docopt;
const source = require('vinyl-source-stream');
const pkg = require('../package.json');

export default function cli(argv = process.argv.slice(2)) {
  let options = docopt(doc, { version: pkg.version, argv: argv });

  if (!options['-'] && !options['<src>'].length) {
    // Trigger help display.
    docopt(doc, { version: pkg.version, argv: ['--help'] });
  }

  let logger = new Logger(options['--verbose'], options['--debug'] || process.env.SASSDOC_DEBUG);
  let env = new Environment(logger, options['--strict']);

  logger.debug('argv:', () => JSON.stringify(argv));

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
    require('./notifier')(pkg, logger);
  }

  let handler, cb;

  // Whether to parse only or to documentize.
  if (!options['--parse']) {
    handler = sassdoc;
    cb = () => {};
  } else {
    handler = parse;
    cb = data => console.log(JSON.stringify(data, null, 2));
  }

  if (options['-']) {
    return process.stdin
      .pipe(source())
      .pipe(handler(env))
      .on('data', cb);
  }

  handler(options['<src>'], env).then(cb);
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
