/**
testing posts
*/
var request = require('request-json');
var client = request.createClient('http://localhost:7088');

var initSzenario = require("./testdatadummyroboter/initSzenario.json");
client.post('/initSzenario', initSzenario, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
