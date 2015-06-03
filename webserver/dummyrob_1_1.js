/**
testing posts
*/
var fs = require('fs');
var request = require('request-json');
var async = require('async');
var deleteDB = require('./deleteDB');

var client = request.createClient('http://localhost:7088');

var datadir = './'+"testdatadummyrob";
console.log(fs.readdirSync(datadir));
var filelist = fs.readdirSync(datadir);


async.eachSeries(filelist, function(filename, cb) {
    
    console.log(filename);
    var file = require(datadir+"/"+filename);
    console.log(filename);
    if(filename.indexOf("actualPosition") > -1){
        client.post('/actualPosition', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
          setTimeout(cb,10000);
        });
    }
    else if(filename.indexOf("newPath") > -1){
        client.post('/newPath', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
          setTimeout(cb,10000);
        });
    }
    else {
        cb();
    }
});
