/**
testing posts
*/
var fs = require('fs');
var request = require('request-json');
var async = require('async');
var deleteDB = require('./deleteDB');
var client = request.createClient('http://localhost:7088');

var data = require('./'+"testdatadummyrob/dummyrob.json");
console.log(data);


async.eachSeries(data, function(json, cb) {
    if(json.url.indexOf("initSzenario") > -1){
        client.post('/'+json.url, json.data, function(err, res, body) {
          console.log(res.body);
        });
        setTimeout(cb,10000);
    }else{
        cb();
    }
});