let chalk = require('chalk');

export default pkg => {
  let notifier = require('update-notifier')({
    packageName: pkg.name,
    packageVersion: pkg.version,
  });

  if (!notifier.update) {
    return;
  }

  let latest = chalk.yellow(notifier.update.latest);
  let current = chalk.grey(`(current: ${notifier.update.current})`);
  let command = chalk.blue(`npm update -g ${pkg.name}`);

  console.log(`Update available: ${latest} ${current}`);
  console.log(`Run ${command} to update.`);
};
