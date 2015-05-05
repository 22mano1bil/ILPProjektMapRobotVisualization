var express = require('express.io');
var app = express();
var path = require('path')


app = require('express.io')()
app.http().io()

// Setup the ready route, and emit talk event.
app.io.route('ready', function(req) {
    req.io.emit('talk', {
        message: 'io event from an io route on the server'
    })
})

app.use(express.static(path.resolve(__dirname + '/../MapWebsite')));

var server = app.listen(7088, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

var bodyParser = require('body-parser')
app.use(bodyParser.json())    // parse application/json

/*
 app.get('/data', function (req, res) {
 res.json("name: " + req.query.name);
 });
 */

app.post('/actualPosition', function(req, res) {
    console.log(req.body);
    req.io.broadcast('actualPosition', req.body)
    res.json(req.body);
});

app.post('/firstPath', function(req, res) {
    console.log(req.body);
    req.io.broadcast('firstPath', req.body)
    res.json(req.body);
});

app.post('/newPath', function(req, res) {
    console.log(req.body);
    req.io.broadcast('firstPath', req.body)
    res.json(req.body);
});



/*Define dependencies.*/
var multer = require('multer');
var done = false;

/*Configure the multer.*/
app.use(multer({dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }
}));

/*Handling routes.*/
app.post('/api/photo', function(req, res) {
    if (done == true) {
        console.log(req.files);
        res.end("File uploaded.");
    }
});