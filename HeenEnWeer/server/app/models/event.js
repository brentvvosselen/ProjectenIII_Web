var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require("./category");

var EventSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    datetime:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    category:{type: Schema.ObjectId, ref: 'Category'}
});

module.exports = mongoose.model('Events',EventSchema);