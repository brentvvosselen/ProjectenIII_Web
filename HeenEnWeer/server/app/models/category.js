var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    type:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category',CategorySchema);