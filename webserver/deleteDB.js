// Mongoose import
var mongoose = require('mongoose');
var models = require('./models');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/'+models.Config.dbname, function(error) {
    if (error) {
        console.log(error);
    }
    mongoose.connection.db.dropDatabase();
});
mongoose.connection.close();