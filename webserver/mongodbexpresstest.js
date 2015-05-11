/*not used*/

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/testuser', function(error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
});

// Mongoose Schema definition
var UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String
});

// Mongoose Model definition
var User = mongoose.model('users', UserSchema);

var nora = new User({first_name: 'Nora'}, {last_name: 'MH'}, {email: 'nmh@web.de'})

nora.save(function(err, nora) {
    if (err)
        return console.error(err);
});

var express = require('express');
// Bootstrap express
var app = express();

// URLS management

app.get('/', function(req, res) {
    res.send("<a href='/users'>Show Users</a>");
});

app.get('/users', function(req, res) {
    User.find({}, function(err, docs) {
        res.json(docs);
    });
});

app.get('/users/:email', function(req, res) {
    if (req.params.email) {
        User.find({email: req.params.email}, function(err, docs) {
            res.json(docs);
        });
    }
});

// Start the server
app.listen(7099);
