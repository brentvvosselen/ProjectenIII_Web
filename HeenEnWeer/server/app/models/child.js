var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChildSchema = new Schema({
    firstname: {
        type: String,
        required: true
      },
      lastname: {
        type: String,
        required: true
      },
      info: String
  });

module.exports = mongoose.model('Child',ChildSchema);
