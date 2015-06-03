// Mongoose import
var mongoose = require('mongoose');
var config = require(__dirname + '/../config.json');

exports.deleteDB = function (cb) {
// Mongoose connection to MongoDB (ted/ted is readonly)
    mongoose.connect(config.dbpath + config.dbname, function (error) {
        if (error) {
            console.log(error);
        }
        mongoose.connection.db.dropDatabase();
    });
    mongoose.connection.close(cb);
};