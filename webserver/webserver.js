var express = require('express');
var app = express();
var path = require('path')

var bodyParser = require('body-parser')
app.use(bodyParser.json())    // parse application/json

var server = app.listen(7088,'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/index.html', function (req, res) {
});
app.use(express.static(path.resolve(__dirname +'/../MapWebsite')));

/*
app.get('/data', function (req, res) {
	res.json("name: " + req.query.name);
});
*/

app.post('/actualPosition', function(req, res) {
    console.log(req.body);
	res.json(req.body);
});

app.post('/firstPath', function(req, res) {
    console.log(req.body);
	res.json(req.body);
});

app.post('/newPath', function(req, res) {
    console.log(req.body);
	res.json(req.body);
});





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



/*Define dependencies.*/
var multer  = require('multer');
var done=false;

/*Configure the multer.*/
app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

/*Handling routes.*/
app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});