var shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  var data = db.get('transaction').value();
  
  var transactions = data.map(function (item) {
    if (item.hasOwnProperty('userId') && item.hasOwnProperty('bookId')) {
      var user = db.get('users').find({userId: item.userId}).value();
      var book = db.get('books').find({bookId: item.bookId}).value();
      
      return {
        user: user.name,
        book: book.title,
        tranId: item.tranId,
        isComplete: item.isComplete
      }
    }
  });
  
  res.render('transactions/index', {transactions});
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
  
  db.get('transaction')
    .find({ tranId: id })
    .set("isComplete", true)
    .write();
  
  res.redirect('/transactions');
}