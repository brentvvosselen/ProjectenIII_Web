var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteeSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    key:{
        type: String,
        unique: true,
        required: true 
    } 
});

module.exports = mongoose.model('Invitees',InviteeSchema);