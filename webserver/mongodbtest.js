var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test2');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    
    
});
var kittySchema = mongoose.Schema({
        name: String
    })

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function() {
        var greeting = this.name
                ? "Meow name is " + this.name
                : "I don't have a name"
        console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema)


    var silence = new Kitten({name: 'Silence'})
    console.log(silence.name) // 'Silence'

    silence.save(function(err, silence) {
        if (err)
            return console.error(err);
        silence.speak();
    });

    var fluffy = new Kitten({name: 'fluffy'});
    fluffy.speak() // "Meow name is fluffy"

    fluffy.save(function(err, fluffy) {
        if (err)
            return console.error(err);
        fluffy.speak();
    });

    Kitten.find(function(err, kittens) {
        if (err)
            return console.error(err);
        console.log(kittens)
    })
var express = require('express');

// Bootstrap express
var app = express();

// URLS management

app.get('/', function (req, res) {
    res.send("<a href='/users'>Show Users</a>");
});

app.get('/users', function (req, res) {
    Kitten.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get('/users/:name', function (req, res) {
    if (req.params.name) {
        Kitten.find({ name: req.params.name }, function (err, docs) {
            res.json(docs);
        });
    }
});

// Start the server
app.listen(7099);
