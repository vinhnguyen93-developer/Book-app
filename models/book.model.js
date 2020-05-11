var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: String,
  description: String,
  bookCover: String,
});

var Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;