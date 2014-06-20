var api = require('../src/api');

api.sassdoc(__dirname + '/sass')
  .then(function (results) {
  	console.log(results);
  }, function (e) {
  	console.log(e);
  });