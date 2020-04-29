var db = require('../db');

module.exports.requireAuth = function(req, res, next) {
  var user = db.get('users').find({ userId: req.cookies.userId }).value();
  
  if (!req.cookies.userId) {
    res.redirect('/auth/login');
    return;
  }
  
  if (!user) {
    res.redirect('/auth/login');
    return;
  }
  
  next();
}