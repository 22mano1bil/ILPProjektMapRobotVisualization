var mongoose = require('mongoose');
var NewPathSchema = mongoose.Schema({
    szenarioname: {type: String, required: true},
    newPath: [{
        x: {type: Number, required: true},
        y: {type: Number, required: true}
    }],
    _szenario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Szenario',
        required: true
    },
    timestamp: {type: Date, required: true}
});

// Mongoose Model definition
var NewPath = module.exports = mongoose.model('NewPath', NewPathSchema);
