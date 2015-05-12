var mongoose = require('mongoose');
// Mongoose Schema definition
var SzenarioSchema = mongoose.Schema({
	_group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group', 
			required: true
        },
    szenarioname: {type: String, unique: true, required: true},
    timestamp: Date,
    floorplanJsonREF: {type: String, required: true},
    modelX3DREF: String
});
// Mongoose Model definition
var Szenario = module.exports = mongoose.model('Szenario', SzenarioSchema);