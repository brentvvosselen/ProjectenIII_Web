var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require("./category");
var Image = require("./image");

var CostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    costCategoryid:{type: Schema.ObjectId, ref: 'CostCategory', required: true},
    picture: {type: Schema.ObjectId, ref: 'Image'},
    children: [{type: Schema.ObjectId, ref:'Child'}]
});

module.exports = mongoose.model('Costs', CostSchema);
