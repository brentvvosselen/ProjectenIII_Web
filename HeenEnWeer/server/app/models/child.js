var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
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
      age:{
        type: Number,
        required:true
      },
      categories: [categorySchema]
  });

module.exports = mongoose.model('Child',ChildSchema);
