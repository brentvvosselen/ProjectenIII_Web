var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CostCategorySchema = new Schema({
    type:{
        type: String,
        required: true
    },
});

module.exports = mongoose.model('CostCategory',CostCategorySchema);