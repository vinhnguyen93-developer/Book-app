var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  profilePictureUrl: String,
  wrongLoginCount: Number
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;