/**
testing posts newPath & actualPosition
*/
var fs = require('fs');
var request = require('request-json');
var async = require('async');
var client = request.createClient('http://localhost:7088');
var config = require(__dirname + '/../config.json');
var dummyroboterfilename = config.dummyroboterfilename;
var data = require('./'+dummyroboterfilename);
console.log(data);


async.eachSeries(data, function(json, cb) {
    if(json.url.indexOf("initSzenario") == -1){
        client.post('/'+json.url, json.data, function(err, res, body) {
          console.log(res.body);
        });
        setTimeout(cb,1500);
    }else{
        cb();
    }
});