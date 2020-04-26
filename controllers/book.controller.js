var shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  res.render('books/index', {
    books: db.get('books').value()
  });
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  var matchedBook = db.get('books').value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('books/index', {
    books: matchedBook
  });
};

module.exports.create  = function(req, res) {
  res.render('books/create');
};

module.exports.delete = function(req, res) {
  var bookId = req.params.bookId;
  
  db.get('books').remove({ bookId: bookId }).write();
  
  res.redirect('/books');
};

module.exports.getUpdate  = function(req, res) {
	var bookId = req.params.bookId;

	var book = db.get('books').find({ bookId: bookId }).value();

	res.render('books/update', {
		book: book,
    bookId: bookId
	});
};

module.exports.postCreate = function(req, res) {
  req.body.bookId = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
};

module.exports.postUpdate = function(req, res) {
  var bookId = req.body.bookId;
  
  db.get('books').find({ bookId: bookId }).assign({ title: req.body.title }).write();
  res.redirect('/books');
};