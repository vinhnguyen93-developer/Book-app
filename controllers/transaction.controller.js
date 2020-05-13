var Transaction = require('../models/transaction.model');
var Session = require('../models/session.model');
var User = require('../models/user.model');
var Book = require('../models/book.model');

module.exports.index = async function(req, res) {
  var data = await Transaction
  .find({ userId: req.signedCookies.userId })
  .populate({path: 'userId', select: 'name'})
  .populate({path: 'bookId', select: 'title'});;

  var dataUser = await User.findById(req.signedCookies.userId);
  
  //pagintion
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var perPage = 5;

  var start = (page - 1) * perPage;
  var end = page * perPage; 
  
  if (data) { 
    var lengthPage = Math.ceil(data.length / perPage);
  } else {
    var lengthPage = Math.ceil(dataUser.length / perPage);
  }
  
  //if data == undefind
  if (!data) {
    res.render('transactions/index');
    return;
  }
  
  //if dataUser === true 
  if (dataUser.isAdmin === true) {
    if (dataUser.id === req.signedCookies.userId) {
      var datas = await Transaction
      .find()
      .populate({path: 'userId', select: 'name'})
      .populate({path: 'bookId', select: 'title'});

      var transactions = datas.map(function (item) {
        return {
          user: item.userId.name,
          book: item.bookId.title,
          tranId: item.id,
          isComplete: item.isComplete
        };
      });
      
      transactions = transactions.slice(start, end);

      res.render('transactions/index', {
        transactions,
        page,
        lengthPage
      });

      return;
    }
  }
  
  var transactions = data.map(function(item) {
    return {
      user: item.userId.name,
      book: item.bookId.title,
      tranId: item.id,
      isComplete: item.isComplete
    };
  });
  
  transactions = transactions.slice(start, end);
  
  res.render('transactions/index', {
    transactions,
    page,
    lengthPage
  });
};

module.exports.create = async function(req, res) {
  var user = await User.find();
  var book = await Book.find();
  
  res.render('transactions/create', {
    books: book,
    users: user
  });
};

module.exports.postCreate = async function(req, res) {
  var session = await Session.findOne({ id: req.signedCookies.sessionId });

  if (session) {
    for (var book in session.cart) {
      for (var i = 0; i < session.cart[book]; i++) {
        await Transaction.create({
          bookId: book,
          userId: req.signedCookies.userId
        });
      }
    }
    
    await Session.findOneAndUpdate(
      { id: req.signedCookies.sessionid },
      { cart: {} }
    );

    res.redirect("/transactions");
    return;
  } else {

    await Transaction.create({
      bookId: req.body.bookId,
      userId: req.body.userId,
      isComplete: false
    });
  }

  res.redirect("/transactions");
};

module.exports.complete = async function(req, res) {
  var id = req.params.id;
  var transaction = await Transaction.findById(id);
  
  if (!transaction) {
    res.redirect('/transactions');
    return;
  }
  
  await Transaction.findByIdAndUpdate(id, { 
    isComplete: true
  });
  
  res.redirect('/transactions');
}