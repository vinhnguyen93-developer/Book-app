// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var low = require('lowdb')
var shortid = require('shortid');

var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
 
var db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [] })
  .write()

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/books', function(req, res) {
  res.render('books/index', {
    books: db.get('books').value()
  });
});

app.get('/books/search', function(req, res) {
  var q = req.query.q;
  var matchedBook = db.get('books').value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('books/index', {
    books: matchedBook
  });
});

app.get('/books/create', function(req, res) {
  res.render('books/create');
});

app.get('/books/:id/delete', function(req, res) {
  var id = req.params.id;
  
  db.get('books').remove({ id: id }).write();
  
  res.redirect('/books');
});

app.get('/books/:id', function(req, res) {
	var id = req.params.id;

	var book = db.get('books').find({ id: id }).value();

	res.render('books/update', {
		book: book,
    id: id
	});
});

app.post('/books/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

app.post('/books/update', function(req, res) {
  var id = req.body.id;
  
  db.get('books').find({ id: id }).assign({ title: req.body.title }).write();
  res.redirect('/books');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
