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
    console.log("a new user");
    //source:http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
    socket.on('switchRoom', function(newroom){
        if (typeof socket.room !== 'undefined') {
            // leave the current room (stored in session)
            socket.leave(socket.room);
            console.log('socket.leave'+socket.room);
        }
            // join new room, received as function parameter
            socket.join(newroom);
            console.log('socket.join'+newroom);
            socket.room = newroom;
    });
});


// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/testuser', function(error) {
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
    szObject.timestamp = new Date();
    console.log(szObject);
    //save in mongodb
    Group.findOne({'groupname': req.body.groupname}, function(err, gr) {
        if (err){
            console.log('cant find group with name:'+req.body.groupname);
            console.error(err);
        }
        if (!err){
            console.log(gr);
			szObject._group_id = gr._id;
            var sz = new Szenario(szObject);
            sz.save(function(err, sz) {
               console.log("saved: " + sz);
               if (err)
                   return console.error(err);
            });
            gr._szenario_ids.push(sz._id);
			console.log(gr);
            gr.save(function(err, gr) {
               console.log("saved: " + gr);
               if (err)
                   return console.error(err);
            });
        }
    });
    res.json(req.body);
});

//Received data from roboter
app.post('/actualPosition', function(req, res) {
    //log
    console.log("received POST /actualPosition : ");
    console.log(req.body);
    var actualPositionObject = req.body;
    //save in mongodb
        Group.find({groupname:req.groupname}, function(err, gr) {
        //get last szenario of this group
		Szenario.findOne({groupid:gr._id}, {}, { sort: {'timestamp': 'desc'}}, function(err, lastszenario) {
			console.log(lastszenario._id);
                        actualPositionObject._szenario_id = lastszenario._id;
                            var ap = new ActualPosition(actualPositionObject);
                            ap.save(function(err, ap) {
                                console.log("saved: " + ap);
                                if (err)
                                    return console.error(err);
                                //broadcast to clients, send when saved (saving validates)
                                io.emit('actualPosition', ap);
                            });
		});
    });
    res.json(req.body);
});

//Received data from roboter
app.post('/newPath', function(req, res) {
    //log
    console.log("received POST /newPath : ");
    console.log(req.body);
    //save in mongodb
    var newPathObject = req.body;
    //get group
    Group.find({groupname:req.groupname}, function(err, gr) {
        //get last szenario of this group
		Szenario.findOne({groupid:gr._id}, {}, { sort: {'timestamp': 'desc'}}, function(err, lastszenario) {
			console.log(lastszenario._id);
                        newPathObject._szenario_id = lastszenario._id;
                            var np = new NewPath(newPathObject);
                            np.save(function(err, np) {
                                console.log("saved: " + np);
                                if (err)
                                    return console.error(err);
                                //broadcast to clients, send when saved (saving validates)
                                io.emit('newPath', np);
                            });
		});
    });
    res.json(req.body);
});


//TESTING AND READING DB

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
app.get('/Sz123/:groupname', function(req, res) {
    Group.find({groupname:req.params.groupname}, function(err, gr) {
		Szenario.findOne({groupid:gr._id}, {}, { sort: {'timestamp': 'desc'}}, function(err, lastszenario) {
			console.log(lastszenario._id);
			res.json(lastszenario);
		});
    });
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



