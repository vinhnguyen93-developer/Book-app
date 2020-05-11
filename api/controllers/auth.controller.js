var User = require('../../models/user.model');

var bcrypt = require('bcrypt');
var sgMail = require('@sendgrid/mail');


module.exports.login = function(req, res) {
  res.json();
};

module.exports.postLogin = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  
  var user = await User.findOne({ email: email });
  
  if (!user) {
    res.json({ 'error': 'User dose not exists.'})
    return;
  }
  
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

    res.json({ 'error': 'You have entered too many wrong attempts.' });
    return;
  }
  
  bcrypt.compare(password, user.password, async function(err, result) {
    if (!result) {
      var user = await User.findOne({ email: email });
      var count = user.wrongLoginCount;

      count++;

      await User.findOneAndUpdate(
        { email: email },
        { wrongLoginCount: count }
      );

      res.json({ 'error': 'Wrong password.' });
      return;
    } else {
      var user = await User.findOne({ email: email });
      res.cookie('userId', user._id, {
        signed: true
      });

      res.redirect('/');
    }
  });
};