var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require("./category");

var EventSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    start:{
        type: Date,
        required: true
    },
    end:{
        type: Date,
        required: true
    },
    categoryid:{type: Schema.ObjectId, ref: 'Category', required: true}
});

module.exports = mongoose.model('Events',EventSchema);