var mongoose = require('mongoose');
var NewPathSchema = mongoose.Schema({
    groupname: {type: String, required: true},
    _szenario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Szenario',
        required: true
    },
    timestamp: {type: Date, required: true},
    newPath: [
        {
            x: Number,
            y: Number
        }
    ]
});

// Mongoose Model definition
var NewPath = module.exports = mongoose.model('NewPath', NewPathSchema);
