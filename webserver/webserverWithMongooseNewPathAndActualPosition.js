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

app.post('/actualPosition', function(req, res) {
    console.log("reserved POST /actualPosition : ");
    console.log(req.body);
    req.io.broadcast('actualPosition', req.body)
    res.json(req.body);
});

//app.post('/firstPath', function(req, res) {
//    console.log(req.body);
//    req.io.broadcast('firstPath', req.body)
//    res.json(req.body);
//});

app.post('/newPath', function(req, res) {
    console.log(req.body);
    req.io.broadcast('firstPath', req.body)
    res.json(req.body);
});



//var fs = require("fs");
//var vm = require('./mongooseSchemaAndModels.js');
//
//var content = fs.readFileSync(filename);
//vm.runInThisContext(content);



// Mongoose import
var mongoose = require('mongoose');


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

var actualPosition = require("./testdatadummyroboter/actualPosition.json");
console.log(actualPosition['actualPosition']);
// Mongoose Model definition
var ActualPosition = mongoose.model('ActualPosition', ActualPositionSchema);

var nora = new ActualPosition(actualPosition);
nora.save(function(err, nora) {
    console.log("saved: " + nora);
    if (err)
        return console.error(err);
});

// URLS management
app.get('/actualPositions', function(req, res) {
    ActualPosition.find({}, function(err, docs) {
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

var NewPathSchema = new Schema({
    robotergroupname: String,
    newPath: [
        {
            x: Number,
            y: Number
        }
    ]
});

var newPath = require("./testdatadummyroboter/newPath.json");
console.log(newPath['newPath']);
// Mongoose Model definition
var NewPath = mongoose.model('NewPath', NewPathSchema);

var nora2 = new NewPath(newPath);
nora2.save(function(err, nora) {
    console.log("saved: " + nora2);
    if (err)
        return console.error(err);
});

 //URLS management
app.get('/NewPaths', function(req, res) {
    NewPath.find({}, function(err, docs) {
        res.json(docs);
    });
});


//var dummyroboter = require('./dummyroboter.js');











/*Define dependencies. its not working anymore since express.io */
//var multer = require('multer');
//var done = false;
//
///*Configure the multer.*/
//app.use(multer({dest: './uploads/',
//    rename: function(fieldname, filename) {
//        return filename + Date.now();
//    },
//    onFileUploadStart: function(file) {
//        console.log(file.originalname + ' is starting ...')
//    },
//    onFileUploadComplete: function(file) {
//        console.log(file.fieldname + ' uploaded to  ' + file.path)
//        done = true;
//    }
//}));
//
///*Handling routes.*/
//app.post('/api/photo', function(req, res) {
//    console.log("getRequest upload");
//    if (done == true) {
//        console.log(req.files);
//        res.end("File uploaded.");
//    }
//});