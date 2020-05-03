var shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  var books = db.get('books').value();
  
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var perPage = 5;
  
  var start = (page - 1) * perPage;
  var end = page * perPage;  
  var lengthPage = Math.ceil(books.length / perPage);
  
  res.render('books/index', {
    books: books.slice(start, end),
    page,
    lengthPage
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
  
  db.get('books')
    .remove({ bookId: bookId })
    .write();
  
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
  
  db.get('books')
    .push(req.body)
    .write();
  
  res.redirect('/books');
};

module.exports.postUpdate = function(req, res) {
  var bookId = req.body.bookId;
  
  db.get('books')
    .find({ bookId: bookId })
    .assign({ title: req.body.title })
    .write();
  
  res.redirect('/books');
};