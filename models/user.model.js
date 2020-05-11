var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  isAdmin: Boolean,
  wrongLoginCount: Number
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;