var db = require('../db');

var bcrypt = require('bcrypt');
var sgMail = require('@sendgrid/mail');


module.exports.login = function(req, res) {
  res.render('auth/login');
};

module.exports.postLogin = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  
  var user = db.get('users').find({ email: email }).value();
  
  //if user input wrong password > 3
  if (user.wrongLoginCount > 3) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    var msg = {
      to: user.email,
      from: 'dinhvinhbb93@gmail.com',
      subject: 'Login warning',
      text: 'Your account has logged in the wrong password more than three times.',
      html: '<strong>Your account has logged in the wrong password more than three times.</strong>',
    };
    
    sgMail
      .send(msg)
      .then(() => {}, error => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body)
        }
      });

    res.render('auth/login', {
      errors: [
        'You have entered too many wrong attempts.'
      ]
    });
    return;
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
    var user = db.get('users').find({ userId: req.signedCookies.userId }).value();
    var count = parseInt(user.wrongLoginCount);
    
    count++;
    
    db.get('users')
      .find({ userId: req.signedCookies.userId })
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
  
  res.cookie('userId', user.userId, {
    signed: true
  });
  res.redirect('/transactions');
};