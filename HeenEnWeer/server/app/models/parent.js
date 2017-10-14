var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var Child = new Schema({
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
});

var ParentSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  addressStreet: {
    type: String,
    required: false
  },
  addressNumber: {
    type: String,
    required: false
  },
  addressPostalcode: {
    type:String,
    required: false
  },
  addressCity: {
    type: String,
    required: false
  },
  telephoneNumber: {
    type: String,
    required: false
  },
  workName: {
    type: String,
    required: false
  },
  workNumber: {
    type:String,
    required: false
  },
  children: [Child]
});

module.exports = mongoose.model('Parents',ParentSchema);
