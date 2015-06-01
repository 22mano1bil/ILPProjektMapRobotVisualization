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
    setTimeout(function (){
    if(filename.indexOf("actualPosition") > -1){
        client.post('/actualPosition', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
        });
    }
    if(filename.indexOf("newPath") > -1){
        client.post('/newPath', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
        });
    }
    }, 10000);
});