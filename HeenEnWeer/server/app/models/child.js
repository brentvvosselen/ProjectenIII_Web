var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = new Schema({
  name: {
    type: String
  },
  value: {
    type: String
  }
})

var categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  info: [infoSchema]
})

var ChildSchema = new Schema({
    firstname: {
        type: String,
        required: true
      },
      lastname: {
        type: String,
        required: true
      },
      gender:{
        type: String,
        enum: ["M","F"],
        required: true
      },
      birthyear:{
        type: String,
        required:true
      },
      categories: [categorySchema]
  });

module.exports = mongoose.model('Child',ChildSchema);
