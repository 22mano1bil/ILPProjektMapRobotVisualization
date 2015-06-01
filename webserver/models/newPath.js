var mongoose = require('mongoose');
var pointSchema = require('./pointSchema');
var NewPathSchema = mongoose.Schema({
    szenarioname: {type: String, required: true},
    newPath: [pointSchema],
    _szenario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Szenario',
        required: true
    },
    timestamp: {type: Date, required: true}
});

// Mongoose Model definition
var NewPath = module.exports = mongoose.model('NewPath', NewPathSchema);
