var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Category = require('./category');

var HeenEnWeerItemSchema = new Schema({
    category: {
        type: Schema.ObjectId, ref:'Category', required:true
    },
    value:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('HeenEnWeerItem',HeenEnWeerItemSchema);