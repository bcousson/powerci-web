require('../models/user');
require('../models/category');
require('../models/provider');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema, ObjectId = Schema.ObjectId;

var Board_instanceSchema   = new Schema({
    label: String,
    description: String,
    image: String,
    model: String,
    version: String,
    created_on: { type: Date, default: Date.now },
    created_by: {type: ObjectId, ref: 'User'},
    comments: [{user: {type: ObjectId, ref: 'User'},body: String, date: Number}],
    nb_niews: Number,
    category_id: {type: ObjectId, ref: 'category'},
    provider_id: {type: ObjectId, ref: 'provider'},
    svg_graphe: String,

    customer_id: ObjectId,
    lab_id: ObjectId,
    board_id: ObjectId
});

module.exports = mongoose.model('Board_instance', Board_instanceSchema);
