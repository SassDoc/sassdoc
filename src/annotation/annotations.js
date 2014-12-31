let path = require('path');
let fs = require('fs');

var annotations = [];

fs.readdirSync(path.resolve(__dirname, './annotations')).forEach(file => {
  if (!file.endsWith('.js')) {
    return;
  }
  annotations.push(require(path.resolve(__dirname, 'annotations', file)).default);
});

module.exports = annotations;
