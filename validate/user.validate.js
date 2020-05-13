var User = require('../models/user.model');

module.exports.postCreate = async function(req, res, next) {
  var email = await User.findOne({ email: req.body.email });
  var errors = [];
  
  if (!req.body.name) {
    errors.push('Name is required.');
  }

  if (req.body.name.length > 30) {
    errors.push('Your name is too long.')
  }
  
  if (!req.body.email) {
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