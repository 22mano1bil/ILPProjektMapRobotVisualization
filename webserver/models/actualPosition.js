var mongoose = require('mongoose');
// Mongoose Schema definition
var ActualPositionSchema = mongoose.Schema({
    robotergroupname: {type: String, required: true},
        _szenario_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Szenario', 
			required: true
        },
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