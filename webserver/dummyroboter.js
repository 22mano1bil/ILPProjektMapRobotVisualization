/**
testing posts
*/
var request = require('request-json');
var client = request.createClient('http://localhost:7088');

var actualPosition = require("./actualPosition.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  return console.log(res.statusCode);
});

var firstPath = require("./firstPath.json");
client.post('/firstPath', firstPath, function(err, res, body) {
  return console.log(res.statusCode);
});

var newPath = require("./newPath.json");
client.post('/newPath', newPath, function(err, res, body) {
  return console.log(res.statusCode);
});

