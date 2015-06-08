/**
testing posts
*/
var request = require('request-json');
var client = request.createClient('http://localhost:7088');


var actualPosition = require("./testdatadummyroboter/actualPosition.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});

var newPath = require("./testdatadummyroboter/newPath.json");
client.post('/newPath', newPath, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});

var newPath = require("./testdatadummyroboter/newPath.json");
client.post('/newPath', newPath, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
