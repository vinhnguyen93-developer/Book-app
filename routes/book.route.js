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

router.get('/:id/delete', function(req, res) {
  var id = req.params.id;
  
  db.get('books').remove({ id: id }).write();
  
  res.redirect('/books');
});

router.get('/:id', function(req, res) {
	var id = req.params.id;

	var book = db.get('books').find({ id: id }).value();

	res.render('books/update', {
		book: book,
    id: id
	});
});

router.post('/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

router.post('/update', function(req, res) {
  var id = req.body.id;
  
  db.get('books').find({ id: id }).assign({ title: req.body.title }).write();
  res.redirect('/books');
});

module.exports = router