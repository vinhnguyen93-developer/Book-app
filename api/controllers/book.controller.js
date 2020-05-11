var cloudinary = require('cloudinary').v2;

var Book = require('../../models/book.model');
var User = require('../../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = async function(req, res) {
  var books = await Book.find();
  res.json(books);
};

module.exports.postCreate = async function(req, res) {
  var user = await Book.create(req.body);
  res.json(user);
};

module.exports.postUpdate = async function(req, res) {
  var id = req.params.id;
  await Book.findByIdAndUpdate(id, {
    name: req.body.name,
    avatar: req.body.avatar
  });
  
  var book = await Book.findById(id);
  res.json(book);
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var book = await Book.findByIdAndDelete(id);
  res.json(book);
};