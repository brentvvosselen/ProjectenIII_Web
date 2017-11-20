var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Child = require("./child");
var Event = require("./event");
var Category = require("./category");
var HeenEnWeerBoek = require('./HeenEnWeerBoek');

var GroupSchema = new Schema({
  
    children: [{type: Schema.ObjectId, ref: 'Child'}],
    events: [{type: Schema.ObjectId, ref: 'Event'}],
    categories: [{type: Schema.ObjectId, ref: 'Category'}],
    costs: [{type: Schema.ObjectId, ref:"Costs"}],
    costCategories: [{type: Schema.ObjectId, ref:"CostCategory"}],
    finance: {
      fintype: {
        type: String,
        required: false
      },
      accepted: [{type: Schema.ObjectId, ref: 'Parent'}],
      kindrekening: {
        maxBedrag: {
          type: Number
        }
      },
      onderhoudsbijdrage: {
        onderhoudsgerechtigde: {type: Schema.ObjectId, ref: 'Parent'},
        onderhoudsplichtige: {type: Schema.ObjectId, ref: 'Parent'},
        percentage: { type: Number }
      }
    },
    heenEnWeerBoekjes: [{type: Schema.ObjectId,ref:'HeenEnWeerBoek'}]
  });

module.exports = mongoose.model('Group',GroupSchema);
