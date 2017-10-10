var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var ParentSchema = new Schema({
  _id: {
    type: String
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
  }
});

ParentSchema.virtual('email').get(function(){
  return this._id;
});
ParentSchema.virtual('email').set(function(email){
  this._id = email;
})



module.exports = mongoose.model('Parents',ParentSchema);
