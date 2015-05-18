//broadcast realtime
var express = require('express')
var app     = express();
var httpserver  = require('http').createServer(app);
var io      = require('socket.io').listen(httpserver);
//path
var path = require('path');
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
var server = httpserver.listen(7088, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


io.on('connection', function(socket){
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
mongoose.connect('mongodb://localhost/testTestForErrors2', function(error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Model definitions
var Group = models.Group;
var Szenario = models.Szenario;
var ActualPosition = models.ActualPosition;
var NewPath = models.NewPath;

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
    res.json(req.body);
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

//Received data from roboter
app.post('/initSzenario', function(req, res) {
    var msg;
    //log
    console.log("received POST /initSzenario : ");
    console.log(req.body);
    var szObject = req.body.szenario;
    var szObjectszname = szObject.szenarioname+ yyyymmddHHMMSS(new Date());
    
    szObject.szenarioname=szObjectszname;
    szObject.timestamp = new Date();
    console.log(szObject);
    //save in mongodb
    Group.findOne({groupname: req.body.groupname}, function(err, gr) {
        if (err){
            console.error(err);
            msg = {error : err};
        }else if(gr == null){
            console.log('cant find group with name:'+req.body.groupname);
            msg = {error:'cant find group with name:'+req.body.groupname};
        }else{
            szObject._group_id = gr._id;
            var sz = new Szenario(szObject);
            sz.save(function(err, sz) {
                if (err){
                    console.error(err);
                    msg ={error:'cant save szenario', information: err};
                }else {
                    console.log("saved: " + sz);
                    gr._szenario_ids.push(sz._id);
                    console.log(gr);
                    gr.save(function(err, gr) {
                       if (err){
                           console.error(err);
                           msg ={error:'cant save group', information: err};
                       }else{
                           console.log("saved: " + gr);
                       }
                    });
                }
            });
        }
    });
    //this is not working for errors
    if(msg == null){
        msg = { success : 'group and szenario saved' };
    }
    console.log(msg);
    res.json(msg);
});

//Received data from roboter
app.post('/actualPosition', function(req, res) {
    var msg;
    //log
    console.log("received POST /actualPosition : ");
    console.log(req.body);
    var actualPositionObject = req.body;
    actualPositionObject.timestamp = new Date();
    
    //save in mongodb
    Group.findOne({groupname:req.body.groupname}, function(err, gr) {
        if(err){
            console.error(err);
            msg = {error : err};
        }else if (gr == null){
            console.log('cant find group with name:'+req.body.groupname);
            msg = {error:'cant find group with name:'+req.body.groupname};
        }else{
            //get last szenario of this group
            Szenario.findOne({_group_id:gr._id}, {}, { sort: {timestamp: 'desc'}}, function(err, lastszenario) {
                console.log(lastszenario);
                if(err){
                    console.error(err);
                    msg = {error : err};
                }else if (lastszenario == null){
                    console.log('cant find szenario of group:'+req.body.groupname);
                    msg = {error:'cant find szenario of group:'+req.body.groupname};
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
        }
    });
    //this is not working for errors
    if(msg === 'undefined'){
        msg = { success : 'group and szenario saved' };
    }
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
    
    //get group
    Group.findOne({groupname:req.body.groupname}, function(err, gr) {
        if(err){
            console.error(err);
            msg = {error : err};
        }else if (gr == null){
            console.log('cant find group with name:'+req.body.groupname);
            msg = {error:'cant find group with name:'+req.body.groupname};
        }else{
            
            //get last szenario of this group
            Szenario.findOne({_group_id:gr._id}, {}, { sort: {timestamp: 'desc'}}, function(err, lastszenario) {
                if(err){
                    console.error(err);
                    msg = {error : err};
                }else if (lastszenario == null){
                    console.log('cant find szenario of group:'+req.body.groupname);
                    msg = {error:'cant find szenario of group:'+req.body.groupname};
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
                        }
                    });
                }
            });
        }
    });
    //this is not working for errors
    if(msg === 'undefined'){
        msg = { success : 'group and szenario saved' };
    }
    console.log(msg);
    res.json(msg);
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
app.get('/init', function(req, res) {
    var json={};
    Group.find({}, function(err, docs) {
        json.groups = docs;
        Szenario.find({}, function(err, docs) {
            json.szenarios = docs;
            res.json(json);
        });
    });
});

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
    dest: 'uploads/modelX3D',
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
    dest: 'uploads/modelX3D',
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
