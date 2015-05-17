var mongoose = require('mongoose');
// Mongoose Schema definition
var ActualPositionSchema = mongoose.Schema({
    groupname: {type: String, required: true},
    _szenario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Szenario',
        required: true
    },
    timestamp: {type: Date, required: true},
    actualPosition: {
        point: {
            x: Number,
            y: Number
        },
        orientation: {
            x: Number,
            y: Number
        }
    }
});

// Mongoose Model definition
var ActualPosition = module.exports = mongoose.model('ActualPosition', ActualPositionSchema);