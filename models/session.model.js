var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
  ss_id: String,
  cart:  Array 
});

var Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;