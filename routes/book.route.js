var express = require('express');
var shortid = require('shortid');

var db = require('../db');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('books/index', {
    books: db.get('books').value()
  });
});

router.get('/search', function(req, res) {
  var q = req.query.q;
  var matchedBook = db.get('books').value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('books/index', {
    books: matchedBook
  });
});

router.get('/create', function(req, res) {
  res.render('books/create');
});

router.get('/:bookId/delete', function(req, res) {
  var bookId = req.params.bookId;
  
  db.get('books').remove({ bookId: bookId }).write();
  
  res.redirect('/books');
});

router.get('/:bookId', function(req, res) {
	var bookId = req.params.bookId;

	var book = db.get('books').find({ bookId: bookId }).value();

	res.render('books/update', {
		book: book,
    bookId: bookId
	});
});

router.post('/create', function(req, res) {
  req.body.bookId = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

router.post('/update', function(req, res) {
  var bookId = req.body.bookId;
  
  db.get('books').find({ bookId: bookId }).assign({ title: req.body.title }).write();
  res.redirect('/books');
});

module.exports = router