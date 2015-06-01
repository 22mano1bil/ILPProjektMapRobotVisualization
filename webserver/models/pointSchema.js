var mongoose = require('mongoose');
var PointSchema = module.exports = mongoose.Schema({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
});