/**
testing posts
*/
var fs = require('fs');
var request = require('request-json');
var client = request.createClient('http://localhost:7088');

var datadir = './'+"testdatadummyrob";
console.log(fs.readdirSync(datadir));
var filelist = fs.readdirSync(datadir);

filelist.forEach(function(filename) {
    var file = require(datadir+"/"+filename);
    if(filename.indexOf("initSzenario") > -1){
        client.post('/initSzenario', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
        });
    }
});