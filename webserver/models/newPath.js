var mongoose = require('mongoose');
var NewPathSchema = mongoose.Schema({
    robotergroupname: {type: String, required: true},
    newPath: [
        {
            x: Number,
            y: Number
        }
    ]
});

// Mongoose Model definition
var NewPath = module.exports = mongoose.model('NewPath', NewPathSchema);
