/**
testing posts
*/
var request = require('request-json');
var client = request.createClient('http://localhost:7088');
var sleep = require('thread-sleep');

var actualPosition = require("./testdatadummyroboter/actualPosition_1.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var newPath = require("./testdatadummyroboter/newPath_1.json");
client.post('/newPath', newPath, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});

var res = sleep(10000);

var actualPosition = require("./testdatadummyroboter/actualPosition_2.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var actualPosition = require("./testdatadummyroboter/actualPosition_3.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var newPath = require("./testdatadummyroboter/newPath_2.json");
client.post('/newPath', newPath, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var actualPosition = require("./testdatadummyroboter/actualPosition_4.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var actualPosition = require("./testdatadummyroboter/actualPosition_5.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var actualPosition = require("./testdatadummyroboter/actualPosition_6.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
var res = sleep(10000);
var actualPosition = require("./testdatadummyroboter/actualPosition_7.json");
client.post('/actualPosition', actualPosition, function(err, res, body) {
  console.log(res.statusCode);
  console.log(res.body);
});
