var db = require('../db');

var Session = require('../models/session.model');

module.exports.addToCart = async function(req, res) {
  var bookId = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  
  if (!sessionId) {
    res.redirect('/books');
    return;
  }
  
  var session = await Session.findById(sessionId);
  
  var count = session.cart.count;
  count++;
  
  await Session.findByIdAndUpdat(sessionId, {
    count: count
  })
  
  res.redirect('/books');
}