var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require('./category');
var HeenEnWeerDag = require('./HeenEnWeerDag');

var HeenEnWeerBoekSchema = new Schema({
    child:{
        type: Schema.ObjectId, 
        ref:"Child", 
        required: true},
    days: [{type: Schema.ObjectId, ref: "HeenEnWeerDag"}]
    
});

module.exports = mongoose.model("HeenEnWeerBoek", HeenEnWeerBoekSchema);