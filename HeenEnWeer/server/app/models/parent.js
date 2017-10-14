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
  address_street: {
    type: String,
    required: false
  },
  address_number: {
    type: String,
    required: false
  },
  address_postalcode: {
    type:String,
    required: false
  },
  address_city: {
    type: String,
    required: false
  },
  number: {
    type: String,
    required: false
  },
  work_name: {
    type: String,
    required: false
  },
  work_number: {
    type:String,
    required: false
  },
  children: [Child]
});

module.exports = mongoose.model('Parents',ParentSchema);
