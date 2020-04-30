var shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  var data = db.get('transaction').find({userId: req.cookies.userId}).value();
  
  var dataUser = db.get('users').find({ isAdmin: true }).value();
  
  //if dataUser === true 
  if (dataUser) {
    if (dataUser.userId === req.cookies.userId) {
      var data = db.get('transaction').value();
      var transactions = data.map(function (item) {
        if (item.hasOwnProperty('userId') && item.hasOwnProperty('bookId')) {
          var user = db.get('users').find({userId: item.userId}).value();
          var book = db.get('books').find({bookId: item.bookId}).value();

          if (user && book) {
            return {
              user: user.name,
              book: book.title,
              tranId: item.tranId,
              isComplete: item.isComplete
            };
          } else {
            return {};
          }

        }
      });

      res.render('transactions/index', {
        transactions
      });

      return;
    }
  }
  
  //if data == undefind
  if (!data) {
    res.render('transactions/index');
    return;
  }
  
  var user = db.get('users').find({ userId: data.userId }).value();
  var book = db.get('books').find({ bookId: data.bookId }).value();
  
  res.render('transactions/index', {
    transactions: [
      { user: user.name, book: book.title, isComplete: data.isComplete }
    ]
  });
};

module.exports.create = function(req, res) {
  res.render('transactions/create', {
    books: db.get('books').value(),
    users: db.get('users').value()
  });
};

module.exports.postCreate = function(req, res) {
  req.body.tranId = shortid.generate();
  db.get('transaction')
    .push(req.body)
    .write();
  
  res.redirect('/transactions');
};

module.exports.complete = function(req, res) {
  var id = req.params.tranId;
  
  if (!db.get('transaction').find({ tranId: id }).value()) {
    res.redirect('/transactions');
    return;
  }
  
  db.get('transaction')
    .find({ tranId: id })
    .set("isComplete", true)
    .write();
  
  res.redirect('/transactions');
}