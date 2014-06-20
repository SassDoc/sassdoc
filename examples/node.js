var api = require('../src/api');

api.parse(__dirname + '/sass').then(function (results) {
  console.log(results);
});