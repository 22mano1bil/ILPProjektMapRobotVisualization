var mongoose = require('mongoose');
var NewPathSchema = mongoose.Schema({
    robotergroupname: {type: String, required: true},
    _szenario_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Szenario', 
			required: true
        },
    newPath: [
        {
            x: Number,
            y: Number
        }
    ]
});

// Mongoose Model definition
var NewPath = module.exports = mongoose.model('NewPath', NewPathSchema);
