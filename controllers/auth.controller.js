var db = require('../db');
var bcrypt = require('bcrypt');

module.exports.login = function(req, res) {
  res.render('auth/login');
};

module.exports.postLogin = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  
  var user = db.get('users').find({ email: email }).value();
  
  //if user input wrong password > 3
  if (user.wrongLoginCount > 3) {
    res.render('auth/login', {
      errors: [
        'You have entered too many wrong attempts.'
      ]
    })
  }
  
  if (!user) {
    res.render('auth/login', {
      errors: [
        'User dose not exists.'
      ],
      values: req.body
    });
    return;
  }
  
  var hashedPassword = bcrypt.compareSync(password, user.password);
  
  if (hashedPassword === false) {
    var user = db.get('users').find({ userId: req.cookies.userId }).value();
    var count = parseInt(user.wrongLoginCount);
    
    count++;
    
    db.get('users')
      .find({ userId: req.cookies.userId })
      .assign({ wrongLoginCount: count })
      .write();
  
    res.render('auth/login', {
      errors: [
        'Wrong password.'
      ],
      values: req.body
    });
    return;
  }
  
  res.cookie('userId', user.userId);
  res.redirect('/transactions');
};