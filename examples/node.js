var api = require('../src/api');

api.parse(__dirname + '/stylesheets').then(function (results) {
  console.log(results);
});