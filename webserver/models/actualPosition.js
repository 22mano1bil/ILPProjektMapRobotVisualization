var mongoose = require('mongoose');
//var pointSchema = require('./pointSchema');
// Mongoose Schema definition
var ActualPositionSchema = mongoose.Schema({
    szenarioname: {type: String, required: true},
    actualPosition: {
        point: {
            x: Number,
            y: Number
        },
        orientation: {
            x: Number,
            y: Number
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