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
    floorplanJSONref: {type: String, required: true},
    modelX3Dref: String
});
// Mongoose Model definition
var Szenario = module.exports = mongoose.model('Szenario', SzenarioSchema);