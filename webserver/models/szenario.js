var mongoose = require('mongoose');
// Mongoose Schema definition
var SzenarioSchema = mongoose.Schema({
    szenarioname: {type: String, unique: true, required: true},
    timestamp: {type: Date, required: true},
    floorplanJSONref: {type: String, required: true},
    modelX3Dref: String,
    startpoint: {
        x: Number,
        y: Number
    }, 
    endpoint: {
        x: Number,
        y: Number
    },
        
});
// Mongoose Model definition
var Szenario = module.exports = mongoose.model('Szenario', SzenarioSchema);