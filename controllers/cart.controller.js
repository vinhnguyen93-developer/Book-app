var Session = require('../models/session.model');

module.exports.addToCart = async function(req, res, next) {
  try {
    var bookId = req.params.id;
    var sessionId = req.signedCookies.sessionId;
    
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    
    var session = await Session.findOne({ ss_id: sessionId });
    var count = 0;

    if (session) {
      // Trường hợp 1: BookId đã tồn tại trong giỏ hàng -> Tìm bookId rồi tăng số lượng.
      for (var i = 0; i < session.cart.length; i++) {
        if (session.cart[i].bookId === bookId) {
          count = session.cart[i].quantity + 1;
          await Session.update({ 
            ss_ids: sessionId, 
            "cart.$.booKId": bookId 
          }, { 
            $set: {
              "cart.$.quantity": count
            }
          }).exec();
          res.redirect('/books');
          return;
        }
      }
      // Trường hợp 2: BookId chưa có trong giỏ hàng
      await Session.update({ 
            ss_id: sessionId, 
          }, { 
            $push: { cart: {
              "bookId": bookId,
              "quantity": 1
            }}
          }).exec();
    }

    res.redirect("/books");
  } catch(error) {
    next(error);
  }
}