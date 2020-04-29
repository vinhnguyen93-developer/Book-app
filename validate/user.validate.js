var db = require('../db');

module.exports.postCreate = function(req, res, next) {
  var email = db.get('users').find({ email: req.body.email }).value();
  var errors = [];
  
  if (!req.body.name) {
    errors.push('Name is required.');
  }
  
  if (!req.body.email) {
    errors.push('Email is required.');
  }
  
  if (req.body.name.length > 30) {
    errors.push('The name is too long.');
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