//broadcast realtime
var express = require('express')
var app     = express();
var httpserver  = require('http').createServer(app);
var io      = require('socket.io').listen(httpserver);
//path
var path = require('path');
var fs = require('fs');
// parse application/json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
//File Upload
var multer = require('multer');
// Mongoose import
var mongoose = require('mongoose');
var async = require('async');
var models = require('./models');
var config = require(__dirname +'/../config.json');

//default send website and make it listen on port
app.use(express.static(path.resolve(__dirname + '/../MapWebsite')));
var server = httpserver.listen(7088, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
//Received data from roboter
app.get('/watchModelX3D', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../MapWebsite/watchModelX3D.html'));
});

app.get('/watchFloorplanJSON', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../MapWebsite/watchModelX3D.html'));
});

app.get('/watchFloorplanJSONandModelX3D', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../MapWebsite/watchModelX3D.html'));
});

app.get('/editModelX3D', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../MapWebsite/watchModelX3D.html'));
});

app.get('/editFloorplanJSON', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../MapWebsite/watchModelX3D.html'));
});
io.on('connection', function(socket){
    socket.emit('hello', { hello: 'socket.io is working' });

    initFiles(function(json){
        socket.emit('initFilesHTML',json);
    });
    
    initSzenario(function(json) {
        socket.emit('initSzenariosHTML',json);
    });  
    console.log("a new user");
    //source:http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
    socket.on('switchSzenario', function(szenarioID){
        if (typeof socket.room !== 'undefined') {
            // leave the current room (stored in session)
            socket.leave(socket.user);
            socket.leave(socket.room);
            console.log('socket.leave '+socket.room);
        }
            // join new room, received as function parameter
            socket.join(szenarioID);
            console.log('socket.join '+szenarioID);
            socket.room = szenarioID;
            sendExistingDataForSzenario(szenarioID, socket);
    });
    socket.on('dummyroboter', function(){
        console.log('dummyroboter');
        if (typeof socket.room !== 'undefined') {
            // leave the current room (stored in session)
            socket.leave(socket.user);
            socket.leave(socket.room);
            console.log('socket.leave '+socket.room);
        }
        sendDummyroboterData(socket);
    })
});

function sendDummyroboterData(socket) {
    var data = require(config.dummyroboterfilename);
    console.log(data);
    var first = true;
    async.eachSeries(data, function(request, cb) {
        console.log(request.data);
        socket.emit(request.url, [request.data]);
        if (!first) {
            setTimeout(cb,2000); 
        }
        else {
            setTimeout(cb,3000);
            first = false;
        }
    });
}

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect(config.dbpath+config.dbname, function(error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Model definitions
var Szenario = models.Szenario;
var ActualPosition = models.ActualPosition;
var NewPath = models.NewPath;


//Received data from roboter
app.post('/initSzenario', function(req, res) {
    //log
    console.log("received POST /initSzenario : ");
    console.log(req.body);
    var szObject = req.body;
    //add timestamp
    szObject.timestamp = new Date();
    console.log(szObject);
    //save in mongodb
    var sz = new Szenario(szObject);
    sz.save(function(err, sz) {
        if (err){
            console.error(err);
            res.json({error:'cant save szenario', information: err});
        }else {
            console.log("saved: " + sz);
            io.emit('promptSzenario',sz);
            initSzenario(function(json) {
                io.emit('initSzenariosHTML',json);
            });  
            res.json({ success : 'szenario saved' });
        }
    });
});

//Received data from roboter
app.post('/actualPosition', function(req, res) {
    //log
    console.log("received POST /actualPosition : ");
    console.log(req.body);
    var actualPositionObject = req.body;
    actualPositionObject.timestamp = new Date();
    
    //save in mongodb
            Szenario.findOne({szenarioname:actualPositionObject.szenarioname}, {}, {}, function(err, lastszenario) {
                console.log(lastszenario);
                if(err){
                    console.error(err);
                    res.json({error : err});
                }else if (lastszenario == null){
                    console.log('cant find szenario with name:'+actualPositionObject.szenarioname);
                    res.json({error:'cant find szenario with name:'+actualPositionObject.szenarioname});
                }else{
                    console.log(lastszenario._id);
                    actualPositionObject._szenario_id = lastszenario._id;
                    var ap = new ActualPosition(actualPositionObject);
                    
                    ap.save(function(err, ap) {
                        if (err){
                            console.error(err);
                            res.json({error : err});
                        }else{
                            console.log("saved: " + ap);
                            //broadcast to clients, send when saved (saving validates)
                            io.to(lastszenario._id).emit('actualPosition', [ap]);
                            res.json({ success : 'actualPosition saved' });
                        }
                    });
                }
            });
});

//Received data from roboter
app.post('/newPath', function(req, res) {
    //log
    console.log("received POST /newPath : ");
    console.log(req.body);
    //save in mongodb
    var newPathObject = req.body;
    newPathObject.timestamp = new Date();
    Szenario.findOne({szenarioname:newPathObject.szenarioname}, {}, {}, function(err, lastszenario) {
        if(err){
            console.error(err);
            res.json({error : err});
        }else if (lastszenario == null){
            console.log('cant find szenario with name:'+newPathObject.szenarioname);
            res.json({error:'cant find szenario with name:'+newPathObject.szenarioname});
        }else{
            console.log(lastszenario._id);
            newPathObject._szenario_id = lastszenario._id;
            var np = new NewPath(newPathObject);

            np.save(function(err, np) {
                if (err){
                    console.error(err);
                    res.json({error : err});
                }else{
                    console.log("saved: " + np);
                    //broadcast to clients, send when saved (saving validates)
                    io.to(lastszenario._id).emit('newPath', [np]);
                    res.json({ success : 'newPath saved' });
                }
            });
        }
    });
});


function sendExistingDataForSzenario(szenarioID,socket) {
    Szenario.find({_id:szenarioID}, function(err, szenario) {
        if (err){
            return console.error(err);
        }else{
            console.log('initSzenario');
            console.log(szenario);
            socket.emit('initSzenario', szenario);
        }
    });
    ActualPosition.findOne({_szenario_id:szenarioID}, {}, { sort: {timestamp: 'desc'}}, function(err, actualPositionArray) {
        if (err){
            return console.error(err);
        }else{
            console.log('actualPosition');
            console.log(actualPositionArray);
            socket.emit('actualPosition', [actualPositionArray]);
        }
    }); 
    NewPath.find({_szenario_id:szenarioID}, {}, { sort: {timestamp: 'asc'}}, function(err, newPathArray) {
        if (err){
            return console.error(err);
        }else{
            console.log('newPath');
            console.log(newPathArray);
            socket.emit('newPath', newPathArray);
        }
    });    
}










var multerForModelX3D = multer(
  {
    dest: path.resolve(__dirname + '/../MapWebsite/uploads/modelX3D'),
    rename: function (fieldname, filename) {
      return filename;
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
      console.log(file.originalname + ' uploaded to  ' + file.path);
    }
  }
);

app.post('/uploadModelX3D', multerForModelX3D, function (req, res) {
  console.log(req.body); // form fields
  console.log(req.files); // form files
  res.status(200).end();
});


var multerForFloorplanJSON = multer(
  {
    dest: path.resolve(__dirname + '/../MapWebsite/uploads/floorplanJSON'),
    rename: function (fieldname, filename) {
      return filename;
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
      console.log(file.originalname + ' uploaded to  ' + file.path);
    }
  }
);

app.post('/uploadFloorplanJSON', multerForFloorplanJSON, function (req, res) {
  console.log(req.body); // form fields
  console.log(req.files); // form files
  res.status(200).end();
});

function initFiles (cb) {
    var json = {};
    json.floorplanJSON = fs.readdirSync(path.resolve(__dirname + '/../MapWebsite/uploads/floorplanJSON'));
    json.modelX3D = fs.readdirSync(path.resolve(__dirname + '/../MapWebsite/uploads/modelX3D'));
    cb(json);
};

function initSzenario (cb) {
    var json={};
    Szenario.find({}, function(err, docs) {
        json.szenarios = docs;
        cb(json);
    });
};




// URLS management
app.get('/initSzenarios', function(req, res) {
    Szenario.find({}, function(err, docs) {
        res.json(docs);
    });
});

// URLS management
app.get('/actualPositions', function(req, res) {
    ActualPosition.find({}, function(err, docs) {
        res.json(docs);
    });
});

// URLS management
app.get('/oneactualPositions', function(req, res) {
    ActualPosition.findOne({}, {}, { sort: {'timestamp': 'desc'}}, function(err, docs) {
        res.json(docs);
    });
});

//URLS management
app.get('/newPaths', function(req, res) {
    NewPath.find({}, function(err, docs) {
        res.json(docs);
    });
});


function yyyymmddHHMMSS(d) {
   var yyyy = d.getFullYear().toString();
   var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = d.getDate().toString();
   var HH = d.getHours().toString();
   var MM = d.getMinutes().toString();
   var SS = d.getSeconds().toString();
   return "/"+yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) + "-"+(dd[1]?dd:"0"+dd[0])+ "/"+(HH[1]?HH:"0"+HH[0])+ ":"+(MM[1]?MM:"0"+MM[0])+ ":"+(SS[1]?SS:"0"+SS[0]); // padding
};