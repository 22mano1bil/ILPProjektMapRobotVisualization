//broadcast realtime
var express = require('express.io');
var app = express();
app = require('express.io')()
app.http().io()
//path
var path = require('path')
// parse application/json
var bodyParser = require('body-parser')
app.use(bodyParser.json())
// Mongoose import
var mongoose = require('mongoose');



//broadcast realtime
// Setup the ready route, and emit talk event.
//app.io.route('ready', function(req) {
//    req.io.emit('talk', {
//        message: 'io event from an io route on the server'
//    })
//})



// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/testuser', function(error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var ActualPositionSchema = new Schema({
    robotergroupname: String,
    actualPosition: {
        point: {
            x: Number,
            y: Number
        },
        orientation: {
            x: Number,
            y: Number
        }
    }
});
// Mongoose Model definition
var ActualPosition = mongoose.model('ActualPosition', ActualPositionSchema);
//Received data from roboter
app.post('/actualPosition', function(req, res) {
    //log
    console.log("received POST /actualPosition : ");
    console.log(req.body);
    //save in mongodb
    var ap = new ActualPosition(req.body);
    ap.save(function(err, ap) {
        console.log("saved: " + ap);
        if (err)
            return console.error(err);
    });
    //broadcast to clients
    req.io.broadcast('actualPosition', req.body)
    res.json(req.body);
});

var NewPathSchema = new Schema({
    robotergroupname: String,
    newPath: [
        {
            x: Number,
            y: Number
        }
    ]
});
// Mongoose Model definition
var NewPath = mongoose.model('NewPath', NewPathSchema);
//Received data from roboter
app.post('/newPath', function(req, res) {
    //log
    console.log("received POST /newPath : ");
    console.log(req.body);
    //save in mongodb
    var np = new NewPath(req.body);
    np.save(function(err, np) {
        console.log("saved: " + np);
        if (err)
            return console.error(err);
    });
    //broadcast to clients
    req.io.broadcast('firstPath', req.body)
    res.json(req.body);
});






// URLS management
app.get('/actualPositions', function(req, res) {
    ActualPosition.find({}, function(err, docs) {
        res.json(docs);
    });
});
//URLS management
app.get('/NewPaths', function(req, res) {
    NewPath.find({}, function(err, docs) {
        res.json(docs);
    });
});
//app.get('/users/:email', function (req, res) {
//    if (req.params.email) {
//        ActualPosition.find({ email: req.params.email }, function (err, docs) {
//            res.json(docs);
//        });
//    }
//});

//var dummyroboter = require('./dummyroboter.js');


//default send website and make it listen on port
app.use(express.static(path.resolve(__dirname + '/../MapWebsite')));
var server = app.listen(7088, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});