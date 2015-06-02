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
var models = require('./models');

//default send website and make it listen on port
app.use(express.static(path.resolve(__dirname + '/../MapWebsite')));
var server = httpserver.listen(7088, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


io.on('connection', function(socket){
    socket.emit('hello', { hello: 'socket.io is working' });
    
//    console.log(initSzenario());
//    console.log(initFiles());
    initFiles(function(json){
        socket.emit('initFiles',json);
    });
    
    initSzenario(function(json) {
        socket.emit('initSzenario',json);
    });
    
    
    socket.userID = Math.floor(Math.random()*1000000000000000).toString();;
    socket.join(socket.userID);
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
            sendExistingDataForSzenario(szenarioID, socket.userID);
    });
});


// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/'+models.Config.dbname, function(error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Model definitions
//var Group = models.Group;
var Szenario = models.Szenario;
var ActualPosition = models.ActualPosition;
var NewPath = models.NewPath;


//Received data from roboter
app.post('/initSzenario', function(req, res) {
    var msg = { success : 'szenario saved' };
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
            msg ={error:'cant save szenario', information: err};
        }else {
            console.log("saved: " + sz);
        }
    });
    console.log(msg);
    res.json(msg);
});

//Received data from roboter
app.post('/actualPosition', function(req, res) {
    var msg = { success : 'actual Position saved' };
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
                    msg = {error : err};
                }else if (lastszenario == null){
                    console.log('cant find szenario with name:'+actualPositionObject.szenarioname);
                    msg = {error:'cant find szenario with name:'+actualPositionObject.szenarioname};
                }else{
                    console.log(lastszenario._id);
                    actualPositionObject._szenario_id = lastszenario._id;
                    var ap = new ActualPosition(actualPositionObject);
                    
                    ap.save(function(err, ap) {
                        if (err){
                            console.error(err);
                        }else{
                            console.log("saved: " + ap);
                            //broadcast to clients, send when saved (saving validates)
                            io.to(lastszenario._id).emit('actualPositionArray', [ap]);
                        }
                    });
                }
            });
    console.log(msg);
    res.json(msg);
});

//Received data from roboter
app.post('/newPath', function(req, res) {
    var msg;
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
                }else{
                    console.log("saved: " + np);
                    //broadcast to clients, send when saved (saving validates)
                    io.to(lastszenario._id).emit('newPathArray', [np]);
                    res.json({ success : 'new Path saved' });
                }
            });
        }
    });
});


function sendExistingDataForSzenario(szenarioID, userID) {
    Szenario.find({_id:szenarioID}, function(err, szenario) {
        if (err)
            return console.error(err);
        console.log('szenario');
        console.log(szenario);
        io.to(userID).emit('szenario', szenario);
    });
    NewPath.find({_szenario_id:szenarioID}, {}, { sort: {timestamp: 'desc'}}, function(err, newPathArray) {
        if (err)
            return console.error(err);
        console.log('newPathArray');
        console.log(newPathArray);
        io.to(userID).emit('newPathArray', newPathArray);
    });    
    ActualPosition.findOne({_szenario_id:szenarioID}, {}, { sort: {timestamp: 'desc'}}, function(err, actualPositionArray) {
        if (err)
            return console.error(err);
        console.log('actualPositionArray');
        console.log(actualPositionArray);
        io.to(userID).emit('actualPositionArray', [actualPositionArray]);
    }); 
}









//TESTING AND READING DB

// URLS management CALLED IN FRONTEND
function initSzenario (cb) {
    var json={};
    Szenario.find({}, function(err, docs) {
        json.szenarios = docs;
        cb(json);
    });
};

// URLS management
app.get('/Groups', function(req, res) {
    Group.find({}, function(err, docs) {
        res.json(docs);
    });
});

// URLS management
app.get('/Szenarios', function(req, res) {
    Szenario.find({}, function(err, docs) {
        res.json(docs);
    });
});

// URLS management
//get last szenario of group
app.get('/Szenario/:groupname', function(req, res) {
    console.log(req.params.groupname);
    Group.findOne({groupname:req.params.groupname}, function(err, gr) {
		Szenario.findOne({_group_id:gr._id}, {}, { sort: {timestamp: 'desc'}}, function(err, lastszenario) {
			console.log(lastszenario._id);
			res.json(lastszenario);
		});
    });
});

// URLS management
app.get('/actualPositions', function(req, res) {
    ActualPosition.findOne({}, {}, { sort: {'timestamp': 'desc'}}, function(err, docs) {
        res.json(docs);
    });
});
app.get('/lastPosition', function(req, res) {
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

// URLS management CALLED IN FRONTEND
function initFiles (cb) {
    var json = {};
    json.floorplanJSON = fs.readdirSync(path.resolve(__dirname + '/../MapWebsite/uploads/floorplanJSON'));
    json.modelX3D = fs.readdirSync(path.resolve(__dirname + '/../MapWebsite/uploads/modelX3D'));
    cb(json);
};


function yyyymmddHHMMSS(d) {
   var yyyy = d.getFullYear().toString();
   var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = d.getDate().toString();
   var HH = d.getHours().toString();
   var MM = d.getMinutes().toString();
   var SS = d.getSeconds().toString();
   return "/"+yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) + "-"+(dd[1]?dd:"0"+dd[0])+ "/"+(HH[1]?HH:"0"+HH[0])+ ":"+(MM[1]?MM:"0"+MM[0])+ ":"+(SS[1]?SS:"0"+SS[0]); // padding
};