/**
testing posts
*/
var request = require('request-json');
var client = request.createClient('http://localhost:7088');

var initGroup = require("./testdatadummyroboter/initGroup.json");
client.post('/initGroup', initGroup, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
