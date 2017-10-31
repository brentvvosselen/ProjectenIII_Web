var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Child = require("./child");
var Event = require("./event");
var Category = require("./category");

var GroupSchema = new Schema({
    children: [{type: Schema.ObjectId, ref: 'Child'}],
    events: [{type: Schema.ObjectId, ref: 'Event'}],
    categories: [{type: Schema.ObjectId, ref: 'Category'}]

  });

module.exports = mongoose.model('Group',GroupSchema);