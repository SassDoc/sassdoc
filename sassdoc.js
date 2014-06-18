var api = require('./src/api');

var userArguments = process.argv.slice(2);

if (userArguments.length > 1) {
  api.documentize(userArguments[0], userArguments[1]);
}

else {
  throw "Not enough arguments.";
}