var User = require('../models/user.model');

module.exports.postCreate = async function(req, res, next) {
  var bodyEmail = req.body.email;
  var name = req.body.name;
  var email = await User.findOne({ email: email });
  var errors = [];
  console.log(name);
  
  if (name === 'undefined') {
    errors.push('Name is required.');
  } else if (name.length > 30) {
    errors.push('Your name is too long.')
  }
  
  if (bodyEmail === 'undefined') {
    errors.push('Email is required.');
  }
  
  if (email) {
    errors.push('This email already exists.')
  }
  
  if (errors.length) {
    res.render('users/create', {
      errors: errors,
      values: req.body
    });
    return;
  }
  
  next();
};