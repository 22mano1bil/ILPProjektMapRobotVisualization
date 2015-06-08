// Mongoose import
var mongoose = require('mongoose');
var config = require(__dirname + '/../config.json');
var models = require('./models');

exports.deleteDB = function (cb) {
// Mongoose connection to MongoDB (ted/ted is readonly)
    mongoose.connect(config.dbpath + config.dbname, function (error) {
        if (error) {
            console.log(error);
        }else{
            mongoose.connection.db.dropDatabase();
        }
    });
    mongoose.connection.close(cb);
};