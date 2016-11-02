var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = Schema.ObjectId;
require("./user");

var categorySchema   = new Schema({
    name: String,
    description: String,
    image: String,
    created_by: {type: ObjectId, ref: 'User'},
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('category', categorySchema);
