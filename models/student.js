var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number
});

module.exports = mongoose.model('Student', studentSchema);