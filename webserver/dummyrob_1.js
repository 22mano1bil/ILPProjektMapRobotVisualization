/**
testing posts
*/
var fs = require('fs');
var request = require('request-json');
var deleteDB = require('./deleteDB');
var client = request.createClient('http://localhost:7088');

var datadir = './'+"testdatadummyrob";
console.log(fs.readdirSync(datadir));
var filelist = fs.readdirSync(datadir);

deleteDB.deleteDB(data);

function data(){
    var data = require('./'+"testdatadummyrob/dummyrob.json");
    console.log(data);
    async.eachSeries(data, function(request, cb) {
        console.log(request.data);
        client.post('/', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
        });
        io.emit(request.url, [request.data]);
        setTimeout(cb,10000);
    });
filelist.forEach(function(filename) {
    var file = require(datadir+"/"+filename);
    if(filename.indexOf("initSzenario") > -1){
        client.post('/initSzenario', file, function(err, res, body) {
          console.log(res.statusCode);
          console.log(res.body);
        });
    }
});

};