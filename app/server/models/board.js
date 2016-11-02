var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.ObjectId; 
require('../models/user');
require('../models/category');

var BoardSchema   = new Schema({
    name: String,
    sub_name : String,
    discription: String,
    image: String,
    category_id: {type: ObjectId, ref: 'categories'},
    manufacturer: String,
    model: String,
    created_date : Number,
    created_by: {type: ObjectId, ref: 'User'},
    nb_units : Number,
    nb_use_cases : Number
});

module.exports = mongoose.model('Board', BoardSchema);
