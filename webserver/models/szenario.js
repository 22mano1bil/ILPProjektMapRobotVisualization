var mongoose = require('mongoose');
// Mongoose Schema definition
var SzenarioSchema = mongoose.Schema({
    szenarioname: {type: String, unique: true, required: true},
    timestamp: {type: Date, required: true},
    floorplanJSONref: {type: String, required: true},
    modelX3Dref: String,
    startpoint: {
        x: {type: Number, required: true},
        y: {type: Number, required: true}
    }, 
    endpoint: {
        x: {type: Number, required: true},
        y: {type: Number, required: true}
    },
        
});
// Mongoose Model definition
SzenarioSchema.path('szenarioname').index({ unique: true });
var Szenario = module.exports = mongoose.model('Szenario', SzenarioSchema);