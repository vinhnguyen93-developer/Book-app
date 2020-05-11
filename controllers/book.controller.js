var cloudinary = require('cloudinary').v2;

var Book = require('../models/book.model');
var User = require('../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = async function(req, res) {
  var books = await Book.find();
  var id = req.signedCookies.userId;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var perPage = 5;
  
  var start = (page - 1) * perPage;
  var end = page * perPage;  
  var lengthPage = Math.ceil(books.length / perPage);
  
  var user = await User.findById(id);

  //var data = db.get('sessions').find({ id: req.signedCookies.sessionId}).get('cart').value();
  
  // if (data) {
  //   res.locals.count = Object.values(data).reduce((sum, item) => sum + item, 0);
  // }
  
  res.render('books/index', {
    books: books.slice(start, end),
    page,
    lengthPage,
    user: user
  });
};

module.exports.search = async function(req, res) {
  var q = req.query.q;
  var books = await Book.find();
  
  var matchedBook = books.filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('books/index', {
    books: matchedBook
  });
};

module.exports.create  = function(req, res) {
  res.render('books/create');
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  
  await Book.findByIdAndDelete(id, {});
  
  res.redirect('/books');
};

module.exports.getUpdate  = async function(req, res) {
	var id = req.params.id;

	var book = await Book.findById(id);

	res.render('books/update', {
		book: book,
    id: id
	});
};

module.exports.postCreate = async function(req, res) {
  
  await Book.create({
    title: req.body.title,
    description: req.body.description
  });
  
  res.redirect('/books');
};

module.exports.postUpdate = async function(req, res) {
  var id = req.body.id;
  var book = await Book.findById(id);
  
  var file = await cloudinary.uploader.upload(req.file.path, 
    function(error, result) {console.log(result, error)});
  
  await Book.findByIdAndUpdate(id, {
    title: req.body.title,
    bookCover: file.url
  });
  
  res.redirect('/books');
};
