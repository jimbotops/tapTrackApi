// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var kv = new Schema({
    target: String,
    value: Number
});
var Group = new Schema({
    title: String,
    keyValue: [kv]
});
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Group', Group);
