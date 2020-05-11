var User = require('../models/user.model');

module.exports.requireAuth = async function(req, res, next) {
  var id = req.signedCookies.userId;
  var user = await User.findById(id);
  
  if (!req.signedCookies.userId) {
    res.redirect('/auth/login');
    return;
  }
  
  if (!user) {
    res.redirect('/auth/login');
    return;
  }
  
  res.locals.user = user;
  
  next();
}