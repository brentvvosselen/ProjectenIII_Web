var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Child = require("./child");

var GroupSchema = new Schema({
    children: [{type: Schema.ObjectId, ref: 'Child'}]
  });

module.exports = mongoose.model('Group',GroupSchema);