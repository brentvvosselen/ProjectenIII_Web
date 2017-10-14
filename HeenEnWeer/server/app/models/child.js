var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var ChildSchema = new Schema({
    geboortedatum: {
        type: String,
        required: false
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    info: {
        type: String,
    },
})

module.exports = mongoose.model('Child',ChildSchema);