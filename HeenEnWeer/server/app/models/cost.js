var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require("./category");

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
    costCategoryid:{type: Schema.ObjectId, ref: 'CostCategory', required: true}
});

module.exports = mongoose.model('Costs', CostSchema);