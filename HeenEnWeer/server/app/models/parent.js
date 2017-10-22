var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Group = require("./group")

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
  type:{
    type: String,
    enum: ["F","M"],
    required: false
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
  group: {type: Schema.ObjectId, ref: 'Group'}
});




module.exports = mongoose.model('Parents',ParentSchema);
