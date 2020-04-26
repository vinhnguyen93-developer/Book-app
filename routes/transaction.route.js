var express = require('express');
var shortid = require('shortid');

var db = require('../db');

var router = express.Router();

router.get('/', function(req, res) {
  var data = db.get('transaction').value();
  
  var transactions = data.map(function (item) {
    if (item.hasOwnProperty('userId') && item.hasOwnProperty('bookId')) {
      var user = db.get('users').find({userId: item.userId}).value();
      var book = db.get('books').find({bookId: item.bookId}).value();
      
      return {
        user: user.name,
        book: book.title
      }
    }
  });
  
  res.render('transactions/index', {transactions});
});

router.get('/create', function(req, res) {
  res.render('transactions/create', {
    books: db.get('books').value(),
    users: db.get('users').value()
  });
});

router.post('/create', function(req, res) {
  req.body.tranId = shortid.generate();
  db.get('transaction').push(req.body).write();
  res.redirect('/transactions');
});

module.exports = router;