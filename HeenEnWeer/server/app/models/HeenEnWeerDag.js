var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HeenEnWeerItem = require('./HeenEnWeerItem');
var Child = require('./child');

var HeenEnWeerDagSchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    items: [{type: Schema.ObjectId, ref:"HeenEnWeerItem"}],
    child:{
        type: Schema.ObjectId, 
        ref:"Child", 
        required: true},

});

module.exports = mongoose.model('HeenEnWeerDag',HeenEnWeerDagSchema);