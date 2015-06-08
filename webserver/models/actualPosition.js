var mongoose = require('mongoose');
//var pointSchema = require('./pointSchema');
// Mongoose Schema definition
var ActualPositionSchema = mongoose.Schema({
    szenarioname: {type: String, required: true},
    actualPosition: {
        point: {
            x: {type: Number, required: true},
            y: {type: Number, required: true}
        },
        orientation: {
            x: {type: Number, required: true},
            y: {type: Number, required: true}
        }
    },
    _szenario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Szenario',
        required: true
    },
    timestamp: {type: Date, required: true},
});

// Mongoose Model definition
var ActualPosition = module.exports = mongoose.model('ActualPosition', ActualPositionSchema);