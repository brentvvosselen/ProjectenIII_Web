var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require("./image");

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
      birthdate:{
        type: Date,
        required:true
      },
      picture: {type: Schema.ObjectId, ref: 'Image'},
      categories: [categorySchema]
  });

module.exports = mongoose.model('Child',ChildSchema);
