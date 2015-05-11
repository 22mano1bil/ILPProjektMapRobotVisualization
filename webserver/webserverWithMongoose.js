//broadcast realtime
var express = require('express.io');
var app = express();
app = require('express.io')();
app.http().io();
//path
var path = require('path');
// parse application/json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
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

var GroupSchema = new Schema({
    groupname: {type: String, unique: true, required: true},
    szenarios: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }]
});
// Mongoose Model definition
var Group = mongoose.model('Group', GroupSchema);


//Received data from roboter
app.post('/initGroup', function(req, res) {
    //log
    console.log("received POST /initGroup : ");
    console.log(req.body);
    //save in mongodb
    var gr = new Group(req.body);
    gr.save(function(err, gr) {
        console.log("saved: " + gr);
        if (err)
            return console.error(err);
    });
    //broadcast to clients
    req.io.broadcast('initGroup', req.body);
    res.json(req.body);
});

// Mongoose Schema definition
var SzenarioSchema = new Schema({
    szenarioname: {type: String, unique: true, required: true},
    floorplanJsonREF: {type: String, required: true},
    modelX3DREF: String
});
// Mongoose Model definition
var Szenario = mongoose.model('Szenario', SzenarioSchema);

yyyymmdd = function(d) {
   var yyyy = d.getFullYear().toString();
   var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = d.getDate().toString();
   var HH = d.getHours().toString();
   var MM = d.getMinutes().toString();
   var SS = d.getSeconds().toString();
   return "/"+yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) + "-"+(dd[1]?dd:"0"+dd[0])+ "/"+(HH[1]?HH:"0"+HH[0])+ ":"+(MM[1]?MM:"0"+MM[0])+ ":"+(SS[1]?SS:"0"+SS[0]); // padding
  };

//Received data from roboter
app.post('/initSzenario', function(req, res) {
    //log
    console.log("received POST /initSzenario : ");
    console.log(req.body);
    var szObject = req.body.szenario;
    var szObjectszname = szObject.szenarioname+ yyyymmdd(new Date());
    szObject.szenarioname=szObjectszname;
    console.log(szObject);
    
//    var sz = new Szenario(req.body.szenario);
//    sz.save(function(err, sz) {
//        console.log("saved: " + sz);
//        if (err)
//            return console.error(err);
//    });
//
//    //save in mongodb
//    Group.findOne({'groupname': req.body.groupname}, function(err, gr) {
//        if (err)
//            return console.error(err);
//        console.log(gr);
//    });

    //broadcast to clients
    req.io.broadcast('actualPosition', req.body);
    res.json(req.body);
});

// Mongoose Schema definition
var ActualPositionSchema = new Schema({
    robotergroupname: {type: String, required: true},
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
    req.io.broadcast('actualPosition', req.body);
    res.json(req.body);
});

var NewPathSchema = new Schema({
    robotergroupname: {type: String, required: true},
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
    req.io.broadcast('firstPath', req.body);
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