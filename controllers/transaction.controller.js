var shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  var data = db.get('transaction').filter({userId: req.signedCookies.userId}).value();
  
  var dataUser = db.get('users').find({ isAdmin: true }).value();
  
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
  
  //if dataUser === true 
  if (dataUser) {
    if (dataUser.userId === req.signedCookies.userId) {
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
      
      transactions = transactions.slice(start, end);

      res.render('transactions/index', {
        transactions,
        page,
        lengthPage
      });

      return;
    }
  }
  
  //if data == undefind
  if (!data) {
    res.render('transactions/index');
    return;
  }
  
  var transactions = data.map(function(item) {
    if(item.hasOwnProperty('userId') && item.hasOwnProperty('bookId')) {
      var user = db.get('users').find({userId: item.userId}).value();
      var book = db.get('books').find({bookId: item.bookId}).value();
      return {
        user: user.name,
        book: book.title,
        tranId: item.tranId,
        isComplete: item.isComplete
      };
    }
  });
  
  transactions = transactions.slice(start, end);
  
  res.render('transactions/index', {
    transactions,
    page,
    lengthPage
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